<template>
    <div class="d-flex flex-row flex-nowrap min-vh-100">
        <!-- 全域 Loader -->
        <div v-if="loading" id="loader-wrapper">
            <div class="loader"></div>
        </div>

        <!-- Main container -->
        <div class="container-fluid">
            <div class="d-flex flex-row flex-nowrap min-vh-200">

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
                <main class="main-content flex-grow-1 p-4">
                    <div class="p-4">
                        <h2>會員評論紀錄</h2>

                        <div>
                            <table class="table table-hover align-middle text-center table-striped">
                                <thead class="table-info">
                                    <tr>
                                        <th>訂單編號</th>
                                        <th>店家名稱</th>
                                        <th>超好吃！</th>
                                        <th>超迅速！</th>
                                        <th>超友善！</th>
                                        <th>超上相！</th>
                                        <th>高CP值！</th>
                                        <th class="comment-text">評論內容</th>
                                        <th>圖片</th>
                                        <th>評論時間</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-if="comments.length === 0">
                                        <td colspan="10" class="py-4 text-muted text-center">尚無資料</td>
                                    </tr>

                                    <tr v-else v-for="comment in comments" :key="comment.commentId">
                                        <td>{{ comment.orderId }}</td>
                                        <td>{{ comment.vendorName }}</td>
                                        <td class="text-center">{{ comment.delicious ? '✓' : '' }}</td>
                                        <td class="text-center">{{ comment.quick ? '✓' : '' }}</td>
                                        <td class="text-center">{{ comment.friendly ? '✓' : '' }}</td>
                                        <td class="text-center">{{ comment.photogenic ? '✓' : '' }}</td>
                                        <td class="text-center">{{ comment.topCP ? '✓' : '' }}</td>
                                        <td class="comment-text">{{ comment.commentContext }}</td>

                                        <td>
                                            <img v-for="(img, idx) in [comment.photo1, comment.photo2, comment.photo3].filter(p => p)"
                                                :key="idx" :src="`${BASE_URL}${img.startsWith('/') ? img : '/' + img}`"
                                                alt="Comment Photo" class="comment-photo"
                                                @click="showImage(`${BASE_URL}${img.startsWith('/') ? img : '/' + img}`)" />
                                        </td>

                                        <td>{{ formatDate(comment.createdAt) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- 放大圖片遮罩 -->
                        <div v-if="activeImage" class="image-overlay" @click="activeImage = null">
                            <img :src="activeImage" alt="Full Image" class="full-image" />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const comments = ref([])
const activeImage = ref(null)  // 點擊放大圖片
const BASE_URL = "http://localhost:8082"  // 後端根目錄

const showImage = (url) => {
    activeImage.value = url
}

// 格式化時間
const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleString()
}

onMounted(async () => {
    try {
        const profileRes = await axios.get('http://localhost:8082/api/member/profile', { withCredentials: true });
        if (profileRes.data && profileRes.data.memberId) {
            const memberId = profileRes.data.memberId
            const commentRes = await axios.get(`http://localhost:8082/comment/bymember/${memberId}`, { withCredentials: true })
            comments.value = commentRes.data
        }
    } catch (err) {
        console.error(err)
        comments.value = []
    }
})
</script>

<style scoped>
h2 {
    margin-top: 30px;
    margin-bottom: 30px;
}

td.comment-text,
th.comment-text {
    max-width: 350px;
    /* 收窄寬度，可調整 */
    white-space: normal;
    /* 允許自動換行 */
    word-wrap: break-word;
    /* 強制換行長單詞 */
}


table {
    width: 100%;
    /* 強制佔滿父容器 */
    min-width: 800px;
    /* 可視需求調整，防止表格過窄 */
    border-collapse: separate;
    /* 使用 separate 才能圓角 */
    border-spacing: 0;
    border-radius: 12px;
    /* 整個表格圓角 */
    overflow: hidden;
    /* 隱藏邊框外的內容 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* 軟陰影 */
}

th,
td {
    padding: 6px;
    text-align: center;
}

.comment-photo {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    margin: 2px;
    transition: transform 0.2s;
}

.comment-photo:hover {
    transform: scale(1.2);
}

/* 放大圖片遮罩 */
.image-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.full-image {
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
}
</style>
