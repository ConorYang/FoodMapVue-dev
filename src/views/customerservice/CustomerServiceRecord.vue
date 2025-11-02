<template>
    <div class="container-fluid">
        <div class="d-flex flex-row flex-nowrap">

            <!-- Sidebar -->
            <nav id="sidebarMenu" class="sidebar bg-light collapse show">
                <ul class="nav flex-column h-100">
                    <li class="nav-item" data-aos="fade-down" data-aos-delay="0">
                        <RouterLink to="/member/memberHome" class="nav-link">
                            <i class="bi-house-fill me-2"></i> Overview
                        </RouterLink>
                    </li>
                    <li class="nav-item" data-aos="fade-down" data-aos-delay="100">
                        <RouterLink to="/member/profile" class="nav-link">
                            <i class="bi-gear me-2"></i> 會員設定
                        </RouterLink>
                    </li>
                    <li class="nav-item" data-aos="fade-down" data-aos-delay="200">
                        <RouterLink to="/member/orderHistory" class="nav-link">
                            <i class="bi-wallet me-2"></i> 訂單紀錄
                        </RouterLink>
                    </li>
                    <li class="nav-item" data-aos="fade-down" data-aos-delay="300">
                        <RouterLink to="/reservationrecords" class="nav-link">
                            <i class="bi-fork-knife me-2"></i> 訂位紀錄
                        </RouterLink>
                    </li>
                    <li class="nav-item" data-aos="fade-down" data-aos-delay="400">
                        <RouterLink to="/cart" class="nav-link">
                            <i class="bi-cart-plus me-2"></i> 購物車
                        </RouterLink>
                    </li>
                    <li class="nav-item" data-aos="fade-down" data-aos-delay="500">
                        <RouterLink to="/member/lookHistory" class="nav-link">
                            <i class="bi-search me-2"></i> 瀏覽紀錄
                        </RouterLink>
                    </li>
                    <li class="nav-item" data-aos="fade-down" data-aos-delay="600">
                        <RouterLink to="/member/commentRecord" class="nav-link">
                            <i class="bi-messenger me-2"></i> 評論紀錄
                        </RouterLink>
                    </li>
                    <li class="nav-item" data-aos="fade-down" data-aos-delay="700">
                        <RouterLink to="/member/favorite" class="nav-link">
                            <i class="bi-search-heart me-2"></i> 我的收藏
                        </RouterLink>
                    </li>
                    <li class="nav-item" data-aos="fade-down" data-aos-delay="800">
                        <RouterLink to="/customerServiceRecord" class="nav-link">
                            <i class="bi-question-circle me-2"></i> 客服中心
                        </RouterLink>
                    </li>
                    <li class="nav-item" data-aos="fade-down" data-aos-delay="900">
                        <RouterLink to="/" class="nav-link">
                            <i class="bi-house me-2"></i> 回首頁
                        </RouterLink>
                    </li>
                    <li class="nav-item border-top pt-2" data-aos="fade-down" data-aos-delay="1000">
                        <a href="#" class="dropdown-item d-flex align-items-center" @click.prevent="logout">
                            <i class="bi-box-arrow-left me-2"></i>
                            登出
                        </a>
                    </li>
                </ul>
            </nav>

            <!-- Main content -->
            <main class="main-content flex-grow-1">

                <h2 class="mb-4 text-center fw-bold ">會員客服紀錄</h2>
                <div class="shadow-sm rounded-3 overflow-hidden" style="width: 80%; margin: 0 auto;">
                    <div class="table-responsive">
                        <table class="table table-hover table-bordered align-middle mb-0">
                            <thead class="table-success text-center align-middle">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">立案時間</th>
                                    <th scope="col">主旨</th>
                                    <th scope="col">內容</th>
                                    <th scope="col">客服回覆</th>
                                    <th scope="col">回覆時間</th>
                                </tr>
                            </thead>
                            <tbody class="text-center">
                                <tr v-if="loading">
                                    <td colspan="6" class="py-4 text-secondary">載入中...</td>
                                </tr>
                                <tr v-else-if="records.length === 0">
                                    <td colspan="6" class="py-4 text-muted">尚無客服紀錄</td>
                                </tr>
                                <tr v-else v-for="(r, index) in records" :key="index">
                                    <td class="fw-semibold text-secondary">{{ index + 1 }}</td>
                                    <td>{{ formatDate(r.createAt) }}</td>
                                    <td class="text-start">{{ r.subject }}</td>
                                    <td class="text-start text-break">{{ r.context }}</td>
                                    <td class="text-start text-break">{{ r.reply || '-' }}</td>
                                    <td>{{ formatDate(r.replyAt) || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const memberId = ref('')
const records = ref([])
const loading = ref(false)

// 取得會員 session
async function fetchMemberSession() {
    try {
        const res = await axios.get('http://localhost:8082/api/member/profile', { withCredentials: true })
        if (res.data) memberId.value = res.data.memberId
    } catch (err) {
        console.error('取得會員資料失敗:', err)
    }
}

// 抓取客服紀錄
async function fetchRecords() {
    if (!memberId.value) return
    loading.value = true
    try {
        const res = await axios.get(`http://localhost:8082/customerservice/${memberId.value}`)
        records.value = res.data || []
    } catch (err) {
        console.error('讀取客服紀錄失敗:', err)
        records.value = []
    } finally {
        loading.value = false
    }
}

// 日期格式化
function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mi = String(d.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}

onMounted(async () => {
    await fetchMemberSession()
    await fetchRecords()
})
</script>

<style scoped>
h2 {
    margin-top: 30px;
}

.cs-page {
    border-radius: 12px;
}

.table {
    font-size: 0.95rem;
}

.table-hover tbody tr:hover {
    background-color: #f8f5f0;
    transition: 0.2s ease-in-out;
}

th {
    white-space: nowrap;
}

td {
    vertical-align: middle;
    word-wrap: break-word;
    white-space: normal;
}

.text-break {
    word-break: break-word;
}
</style>
