<template>

    <!-- 黑名單 -->
    <div v-if="isblack" class="has-comment-message">
        <div class="alert alert-danger">
            <strong>⚠️</strong> 目前為黑名單，無法進行評論，請洽客服
        </div>
    </div>

    <!-- 已有評論 -->
    <div v-else-if="hasComment" class="has-comment-message">
        <div class="alert alert-info">
            <strong>✓</strong> 您已對此訂單發表過評論
        </div>
    </div>

    <!-- 評論表單 -->
    <div class="feedback-container" v-else>
        <div class="rating-section">
            <div class="rating-title">這間餐廳如何呢？</div>

            <!-- TAGS -->
            <div class="rating-tags">
                <button v-for="(tag, i) in tags" :key="i" class="button-74" :class="{ active: tag.selected }"
                    @click="tag.selected = !tag.selected">
                    {{ tag.label }}
                </button>
            </div>

            <!-- Comment -->
            <div id="comment-section">
                <textarea v-model="commentContext" maxlength="500" placeholder="對這間餐廳有什麼想法嗎？幫助更多人知道..."></textarea>
            </div>

            <!-- 圖片上傳 -->
            <div id="photo-upload">
                <input type="file" multiple @change="handleFiles" accept="image/*" />
                <p>最多可選三張圖片</p>
                <div class="preview">
                    <img v-for="(img, index) in previewImages" :key="index" :src="img" width="100" />
                </div>
            </div>

            <div>
                <button type="submit" id="submit" class="btn btn-primary" autocomplete="off" @click="CommentSubmit"
                    :disabled="isSubmitting">
                    {{ isSubmitting ? '送出中...' : '送出評論' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, defineProps } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const props = defineProps({
    orderId: {
        type: Number,
        default: null
    }
});

const tags = reactive([
    { label: '超美味！', field: 'delicious', selected: false },
    { label: '超迅速！', field: 'quick', selected: false },
    { label: '超友善！', field: 'friendly', selected: false },
    { label: '超上相！', field: 'photogenic', selected: false },
    { label: '高CP值！', field: 'topCP', selected: false }
]);

const commentContext = ref('');
const selectedFiles = ref([]);
const previewImages = ref([]);
const hasComment = ref(false);
const isSubmitting = ref(false); // ← 防止重複提交

function handleFiles(event) {
    const files = Array.from(event.target.files).slice(0, 3);
    selectedFiles.value = files;
    previewImages.value = files.map(file => URL.createObjectURL(file));
}

async function CommentSubmit() {
    if (!props.orderId) {
        Swal.fire('錯誤', '找不到訂單編號', 'error');
        return;
    }

    // ✅ 防止重複提交
    if (isSubmitting.value) {
        return;
    }

    // ✅ 驗證至少選擇一個標籤或填寫評論
    const hasTag = tags.some(tag => tag.selected);
    if (!hasTag && !commentContext.value.trim()) {
        Swal.fire('提示', '請至少選擇一個標籤或填寫評論內容', 'warning');
        return;
    }

    isSubmitting.value = true;

    try {
        const formData = new FormData();
        formData.append('orderId', props.orderId);
        formData.append('commentContext', commentContext.value);
        tags.forEach(tag => formData.append(tag.field, tag.selected));
        selectedFiles.value.forEach(file => formData.append('photos', file));

        const response = await axios.post('http://localhost:8082/comment/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        Swal.fire('成功', '評論已送出', 'success');

        // 清空表單
        commentContext.value = '';
        tags.forEach(tag => tag.selected = false);
        selectedFiles.value = [];
        previewImages.value = [];

        // ✅ 設定為已評論
        hasComment.value = true;

    } catch (error) {
        console.error(error);

        // ✅ 處理已評論的情況
        if (error.response?.status === 409) {
            Swal.fire('提示', '此訂單已有評論', 'info');
            hasComment.value = true;
        } else {
            Swal.fire('失敗', '無法送出評論', 'error');
        }
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(async () => {
    if (!props.orderId) {
        return;
    }

    try {
        const response = await axios.get(`http://localhost:8082/comment/byorder/${props.orderId}`);
        if (response.data) {
            hasComment.value = true;
        }
    } catch (error) {
        hasComment.value = false;
    }
});

const isblack = ref(false);
// 確認登入資訊，黑名單(status: 3)無法評論
onMounted(async () => {
    const res = await axios.get('http://localhost:8082/api/currentUser', { withCredentials: true });
    // console.log(res.data.user.status);
    if (res.data.user.status === 3) {
        isblack.value = true;
    }

});
</script>

<style scoped>
/* 已評論提示 */
.has-comment-message {
    padding: 20px;
}

.alert {
    padding: 15px;
    border-radius: 8px;
    background: #d1ecf1;
    border: 1px solid #bee5eb;
    color: #0c5460;
}

.alert strong {
    font-size: 1.2rem;
    margin-right: 8px;
}

/* 提交按鈕禁用狀態 */
#submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* 原有樣式保持不變 */
textarea {
    width: 95%;
    padding: 10px;
    border: 1px solid #c2a58a;
    border-radius: 6px;
    margin-bottom: 20px;
    margin-top: 20px;
    background-color: #fdfcf9;
    resize: vertical;
    height: 120px;
    font-size: large;
}

.feedback-container {
    max-width: 800px;
    margin: auto;
    margin-top: 30px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
}

.rating-section {
    margin-bottom: 1.5rem;
}

.rating-title {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
    color: #5c3d2e;
}

.preview img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-top: 5px;
    border-radius: 8px;
}

#submit {
    margin-top: 20px;
}

.button-74 {
    border: none;
    border-radius: 25px;
    padding: 10px 22px;
    font-weight: 600;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    margin-right: 20px;
    transition: all 0.15s ease-in-out;
}

/* hover 效果 */
.button-74:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
}

/* 顏色配置：顯眼但不刺眼 */
.button-74:nth-child(1) {
    background-color: #E07A5F;
    /* 暖橘紅 - 熱情、美味 */
}

.button-74:nth-child(2) {
    background-color: #81B29A;
    /* 柔和綠 - 清爽、迅速 */
}

.button-74:nth-child(3) {
    background-color: #6d72a6;
    /* 深靜藍 - 穩重、友善 */
}

.button-74:nth-child(4) {
    background-color: #9A8C98;
    /* 溫柔紫 - 美觀、上相 */
}

.button-74:nth-child(5) {
    background-color: #F2CC8F;
    /* 柔金黃 - 高CP值、愉悅 */
    color: #4b3b1f;
    /* 黃底用深棕字 */
}

/* 被選取狀態 */
.button-74.active {
    transform: scale(0.95) translateY(1px);
    filter: brightness(0.85);
    box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.3),
        0 0 6px rgba(0, 0, 0, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.6);
}



#photo-upload input[type="file"]::file-selector-button {
    background-color: #4CAF50;
    color: white;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}

#photo-upload input[type="file"]::file-selector-button:hover {
    background-color: #45a049;
}
</style>
