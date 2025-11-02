<template>
  <div class="d-flex">
    <!-- 側邊欄 -->
    <nav id="sidebarMenu">
      <div class="bg-light p-3 vh-100" style="width: 220px">
        <h4 class="mb-2">管理員儀表板</h4>
        <ul class="nav flex-column">
          <li class="nav-item mb-2">
            <RouterLink class="nav-link" to="/admin/adminHome">
              <i class="bi bi-speedometer2 me-2"></i> 儀表板
            </RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink class="nav-link" to="/admin/adminAccounts">
              <i class="bi bi-person-fill-gear me-2"></i> 帳號管理
            </RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink class="nav-link" to="/admin/blackList">
              <i class="bi bi-person-fill-slash me-2"></i> 黑名單管理
            </RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink class="nav-link" to="/admin/adminProductReview">
              <i class="bi bi-card-checklist me-2"></i> 商品審核
            </RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink class="nav-link" to="/admin/customerServiceManager">
              <i class="bi bi-person-fill-gear me-2"></i> 客服案件管理
            </RouterLink>
          </li>
          <li class="nav-item border-top mt-auto pt-2">
            <RouterLink class="nav-link" to="/logout">
              <i class="bi bi-box-arrow-left me-2"></i> Logout
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 主要內容區 -->
    <div class="flex-grow-1 p-4">
      <h2 class="mb-4">商品審核列表</h2>

      <!-- 篩選區 -->
      <div class="d-flex flex-wrap align-items-center gap-3 mb-4">
        <input
          type="text"
          v-model="filters.keyword"
          class="form-control w-auto"
          placeholder="搜尋店家或商品名稱..."
          style="min-width: 250px"
          @input="currentPage = 0"
        />
        <select
          v-model="filters.status"
          class="form-select w-auto"
          @change="currentPage = 0"
        >
        <option value="">全部狀態</option>
        <option value="審核中">審核中</option>
        <option value="審核不通過">審核不通過</option>
        <option value="上架中">上架中</option>
        <option value="已下架">已下架</option>
        </select>
        
        <!-- 統計資訊 -->
        <div class="ms-auto d-flex align-items-center gap-3">
          <span class="badge bg-warning text-dark fs-6">
            審核中: {{ statusCount.審核中 }}
          </span>
          <span class="badge bg-success fs-6">
            已上架: {{ statusCount.上架中 }}
          </span>
          <span class="badge bg-secondary fs-6">
            已下架: {{ statusCount.已下架 }}
          </span>
          <span class="badge bg-danger fs-6">
          未通過: {{ statusCount.審核不通過 }}
          </span>
        </div>

        <!-- 每頁筆數 -->
        <label class="me-2">每頁筆數：</label>
        <select
          v-model.number="pageSize"
          class="form-select w-auto"
          @change="currentPage = 0"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <!-- 商品審核表格 -->
      <div class="table-responsive shadow-sm rounded">
        <table class="table table-hover align-middle text-center">
          <thead class="table-primary">
            <tr>
              <th>商品圖片</th>
              <th>廠商編號</th>
              <th>店家名稱</th>
              <th>商品名稱</th>
              <th>原價</th>
              <th>特價</th>
              <th>庫存</th>
              <th>有效日期</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedProducts" :key="item.productId">
              <!-- 商品圖片 -->
              <td>
                <div class="product-image-container">
                  <img
                    v-if="item.picUrl"
                    :src="getImageUrl(item.picUrl)"
                    alt="商品圖片"
                    class="product-thumbnail"
                  />
                  <div v-else class="no-image-placeholder">
                    <i class="bi bi-image"></i>
                  </div>
                </div>
              </td>
              <!-- 廠商編號 -->
              <td>{{ item.vendorId }}</td>
              <!-- 店家名稱 -->
              <td>{{ item.vendorName || '未知店家' }}</td>
              <!-- 商品名稱 -->
              <td>
                <div class="product-name-cell">{{ item.productName }}</div>
              </td>
              <!-- 原價 -->
              <td>${{ item.unitPrice }}</td>
              <!-- 特價 -->
              <td>
                <span v-if="item.specialPrice" class="text-danger fw-bold">
                  ${{ item.specialPrice }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <!-- 庫存 -->
              <td>{{ item.stock }}</td>
              <!-- 有效日期 -->
              <td>{{ formatDate(item.endDate) }}</td>
              <!-- 狀態 -->
              <td>
                <span
                  :class="[
                    'badge',
                    item.status === '審核中'
                      ? 'bg-warning text-dark'
                      : item.status === '上架中'
                      ? 'bg-success'
                      : item.status === '已下架'
                      ? 'bg-secondary'
                      : 'bg-danger',
                  ]"
                >
                  {{ item.status==='審核不通過'?'未通過':item.status }}
                      <!--  ⬆️ 加上三元運算子，只改顯示文字 -->
                </span>
              </td>
              <!-- 操作 -->
              <td>
                <div class="d-flex justify-content-center gap-2">
                  <button
                    v-if="item.status === '審核中'"
                    class="btn btn-outline-success btn-sm"
                    @click="review(item, '上架中')"
                  >
                    <i class="bi bi-check-circle me-1"></i>上架
                  </button>
                  <button
                    v-if="item.status === '審核中'"
                    class="btn btn-outline-danger btn-sm"
                    @click="review(item, '審核不通過')"
                  >
                    <i class="bi bi-x-circle me-1"></i>退回
                  </button>
                  <button
                    v-if="item.status === '審核不通過'"
                    class="btn btn-outline-info btn-sm"
                    @click="showReason(item)"
                  >
                    <i class="bi bi-info-circle me-1"></i>查看原因
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedProducts.length === 0">
              <td colspan="10" class="text-center text-muted py-3">
                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                {{ filters.keyword || filters.status ? '無符合條件的商品' : '目前無商品' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分頁控制 -->
      <nav class="mt-3" v-if="totalPages > 1">
        <ul class="pagination justify-content-center">
          <li
            class="page-item"
            :class="{ disabled: currentPage === 0 }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
              上一頁
            </a>
          </li>
          <li
            v-for="n in totalPages"
            :key="n"
            class="page-item"
            :class="{ active: currentPage === n - 1 }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(n - 1)">
              {{ n }}
            </a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages - 1 }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
              下一頁
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useNotificationStore } from "@/stores/notification";
import api from "@/api/axiosInstance";
import Swal from "sweetalert2";

const notificationStore = useNotificationStore();
const products = ref([]);
const filters = reactive({
  keyword: "",
  status: "",
});
const currentPage = ref(0);
const pageSize = ref(10);

// 前端篩選
const filteredProducts = computed(() => {
  return products.value.filter((item) => {
    // 關鍵字搜尋 (店家名稱或商品名稱)
    const matchKeyword =
      !filters.keyword ||
      item.vendorName?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      item.productName?.toLowerCase().includes(filters.keyword.toLowerCase());

    // 狀態篩選
    const matchStatus = !filters.status || item.status === filters.status;

    return matchKeyword && matchStatus;
  });
});

// 前端分頁
const paginatedProducts = computed(() => {
  const start = currentPage.value * pageSize.value;
  return filteredProducts.value.slice(start, start + pageSize.value);
});

// 分頁總頁數
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / pageSize.value)
);

// 狀態統計
const statusCount = computed(() => {
  const count = {
    審核中: 0,
    上架中: 0,
    已下架: 0,
    審核不通過: 0,
  };
  products.value.forEach((item) => {
    if (count.hasOwnProperty(item.status)) {
      count[item.status]++;
    }
  });
  return count;
});

// 換頁
const changePage = (page) => {
  if (page < 0 || page >= totalPages.value) return;
  currentPage.value = page;
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-';
  // 如果是 LocalDate 格式（YYYY-MM-DD）直接回傳
  if (typeof dateString === 'string' && dateString.includes('-')) {
    return dateString.split('T')[0];
  }
  return dateString;
};

// 取得完整圖片 URL
const getImageUrl = (filename) => {
  if (!filename) return '';
  return filename.startsWith("http")
    ? filename
    : `http://localhost:8082/Product_Pic/${filename}`;
};

// ✅ 載入商品資料的函式
const loadProducts = async () => {
  try {
    const res = await api.get("/vProduct/Admin/all", { withCredentials: true });
    products.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("取得商品列表失敗：", err);
  }
};

// ✅ 頁面掛載時呼叫
onMounted(() => {
  loadProducts();

  // 每隔 10 秒自動刷新一次
  setInterval(loadProducts, 5000);
});
// // ✅ 修改：載入商品資料（改用新的 API）
// onMounted(async () => {
//   try {
//     const res = await api.get("/vProduct/Admin/all", { withCredentials: true });
    
//     console.log("API 回傳資料:", res.data);
    
//     // 處理回傳資料
//     products.value = Array.isArray(res.data) ? res.data : [];
    
//     if (products.value.length === 0) {
//       console.warn("目前沒有商品");
//     }
//   } catch (err) {
//     console.error("取得商品列表失敗：", err);
//     console.error("錯誤詳情:", err.response?.data);
    
//     Swal.fire({
//       title: "錯誤",
//       text: err.response?.data?.message || "無法取得商品列表，請確認您的權限",
//       icon: "error"
//     });
//   }
// });

// 審核商品
const review = async (item, status) => {
  let reason = "";

  // 如果是退回，先詢問原因
  if (status === "審核不通過") {
    const { value, isConfirmed } = await Swal.fire({
      title: "請輸入退回原因",
      input: "textarea",
      inputPlaceholder: "請說明為何退回此商品...",
      showCancelButton: true,
      confirmButtonText: "確認退回",
      cancelButtonText: "取消",
      confirmButtonColor: "#dc3545",
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("請輸入退回原因！");
        }
        return value;
      },
    });

    if (!isConfirmed || !value) return;
    reason = value;
  } else {
// 如果是上架，先確認
const result = await Swal.fire({
  title: "確認上架？",
  html: `
    <div class="text-start">
      <div class="text-center mb-3">
        ${item.picUrl 
          ? `<img src="${getImageUrl(item.picUrl)}" 
                  alt="商品圖片" 
                  style="max-width: 200px; max-height: 200px; object-fit: cover; border-radius: 8px; border: 2px solid #e8dcc8;" />`
          : `<div style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; background-color: #f5f5f5; border-radius: 8px; border: 2px solid #e0e0e0; margin: 0 auto;">
               <i class="bi bi-image" style="font-size: 3rem; color: #999;"></i>
             </div>`
        }
      </div>
      <p><strong>商品名稱：</strong>${item.productName}</p>
      <p><strong>店家名稱：</strong>${item.vendorName}</p>
      <p><strong>原價：</strong>$${item.unitPrice}</p>
      ${item.specialPrice ? `<p><strong>特價：</strong>$${item.specialPrice}</p>` : ''}
      <p><strong>庫存：</strong>${item.stock}</p>
      <p><strong>有效期限：</strong>${formatDate(item.endDate)}</p>
    </div>
  `,
  // icon: "question",
  showCancelButton: true,
  confirmButtonText: "確認上架",
  cancelButtonText: "取消",
  confirmButtonColor: "#28a745",
  width: '500px',  // 增加寬度讓圖片顯示更好
});

    if (!result.isConfirmed) return;
  }

  try {
    const res = await api.put(
      `/vProduct/${item.productId}/review`,
      {
        status,
        reason,
      },
      { withCredentials: true }
    );

    // 更新成功
    await Swal.fire({
      title: "更新成功！",
      text: status === "上架中" ? "商品已成功上架" : "商品審核不通過",
      icon: "success",
      timer: 2000,
    });

    // 更新本地資料
    item.status = res.data.status;
    if (res.data.reason) {
      item.reason = res.data.reason;
    }
     try {
      const message = status === "上架中" 
        ? `您的商品「${item.productName}」已審核通過並上架！`
        : `您的商品「${item.productName}」審核不通過，原因：${reason}`;
      
      // 呼叫後端 API 發送通知
      await api.post('/notifications/vendor/product', {
        vendorId: item.vendorId,
        productId: item.productId,
        message: message,
        type: 'product'
      }, { withCredentials: true });
      
      console.log('✅ 已發送通知給店家');
    } catch (notifyError) {
      console.error('⚠️ 發送通知失敗（不影響審核結果）:', notifyError);
    }
  } catch (err) {
    console.error("審核失敗：", err);
    Swal.fire({
      title: "錯誤",
      text: err.response?.data?.message || "審核操作失敗，請稍後再試",
      icon: "error"
    });
  }
};

// 查看退回原因
const showReason = (item) => {
  Swal.fire({
    title: "退回原因",
    html: `
      <div class="text-start">
        <p><strong>商品名稱：</strong>${item.productName}</p>
        <p><strong>店家名稱：</strong>${item.vendorName}</p>
        <p><strong>廠商編號：</strong>${item.vendorId}</p>
        <hr>
        <p><strong>退回原因：</strong></p>
        <p class="text-danger">${item.reason || "無原因記錄"}</p>
      </div>
    `,
    icon: "info",
    confirmButtonText: "關閉",
  });
};
</script>

<style scoped>
.table td,
.table th {
  vertical-align: middle;
}

.badge {
  font-size: 0.9rem;
  padding: 0.5em 0.75em;
}

/* 商品圖片縮圖 */
.product-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e8dcc8;
}

.no-image-placeholder {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  color: #999;
}

.no-image-placeholder i {
  font-size: 1.5rem;
}

/* 商品名稱欄位 */
.product-name-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 側邊欄連結樣式 */
#sidebarMenu .nav-link {
  color: #495057;
  transition: all 0.3s;
}

#sidebarMenu .nav-link:hover {
  background-color: #e9ecef;
  border-radius: 5px;
}

#sidebarMenu .router-link-active {
  color: white;
  border-radius: 5px;
}

/* 分頁按鈕樣式 */
.pagination .page-link {
  cursor: pointer;
}
</style>