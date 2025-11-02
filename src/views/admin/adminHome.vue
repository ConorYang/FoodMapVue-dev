<template>
  <div class="d-flex">
    <!-- 側邊欄 -->
    <nav id="sidebarMenu">
      <div class="bg-light p-3 vh-100" style="width: 100%">
        <h4 class="mb-2">管理員儀表板</h4>
        <ul class="nav flex-column">
          <li class="nav-item mb-2">
            <RouterLink class="nav-link" to="/admin/adminHome">
              <i class="bi bi-speedometer2 me-2"></i> 儀表板
            </RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink class="nav-link" to="/admin/adminAccounts">
              <i class="bi-person-fill-gear me-2"></i>帳號管理
            </RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink class="nav-link" to="/admin/blackList">
              <i class="bi bi-person-fill-slash me-2"></i>黑名單管理
            </RouterLink>
          </li>
              <li class="nav-item mb-2">
            <RouterLink class="nav-link" to="/admin/adminProductReview">
              <i class="bi-card-checklist me-2"></i> 商品審核
            </RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink class="nav-link" to="/admin/customerServiceManager">
              <i class="bi-person-fill-gear me-2"></i> 客服案件管理
            </RouterLink>
          </li>
          <li class="nav-item border-top mt-auto pt-2">
            <RouterLink class="nav-link" to="/logout">
              <i class="bi-box-arrow-left me-2"></i> Logout
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 主要內容區 -->
    <div class="flex-grow-1 p-3">
      <!-- 帳號統計圖表區 -->
      <div class="row g-3 mb-3 align-items-start">
        <!-- 左邊：長條圖（置中） -->
        <div class="col-lg-5 col-md-12 d-flex justify-content-center">
          <div class="card shadow-sm w-100" style="max-width: 550px">
            <div class="card-body">
              <h5 class="card-title text-center mb-3">帳號總覽</h5>
              <account-stats-chart :users="users" />
            </div>
          </div>
        </div>

        <!-- 右邊：三個資訊框 -->
        <div class="col-lg-6 col-md-12">
          <div class="row g-3">
            <div class="col-12" v-for="(card, index) in infoCards" :key="index">
              <div
                class="card border-start border-4 shadow-sm"
                :class="card.border"
              >
                <div class="card-body text-center">
                  <h6 class="fw-semibold mb-1" :class="card.textClass">
                    {{ card.title }}
                  </h6>
                  <p class="fs-6 text-muted mb-0">{{ card.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- router-view 放置各功能頁面 -->
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AccountStatsChart from "@/views/admin/accountStatsChart.vue";

const users = ref([]);

const infoCards = [
  {
    title: "今日登入",
    desc: "功能待加入",
    border: "border-info",
    textClass: "text-info",
  },
  {
    title: "本週新增",
    desc: "功能待加入",
    border: "border-success",
    textClass: "text-success",
  },
  {
    title: "系統通知",
    desc: "功能待加入",
    border: "border-secondary",
    textClass: "text-secondary",
  },
];

// 取得帳號列表 API
const fetchUsers = async () => {
  try {
    const res = await fetch("/api/accounts/list");
    const data = await res.json();
    users.value = data.content || [];
  } catch (err) {
    console.error("取得帳號資料失敗:", err);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.card {
  margin: 0;
  padding: 0;
  margin-top: 20px;
  width: 100%;
  border-radius: 0.8rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
</style>
