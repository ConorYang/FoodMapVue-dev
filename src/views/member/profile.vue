<template>
  <div class="container-fluid">
    <div class="d-flex flex-row flex-nowrap">

      <!-- Sidebar -->
      <nav id="sidebarMenu" class="sidebar bg-light collapse show">
        <ul class="nav flex-column h-100">
          <li class="nav-item">
            <RouterLink to="/member/memberHome" class="nav-link">
              <i class="bi-house-fill me-2"></i> Overview
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/member/profile" class="nav-link">
              <i class="bi-gear me-2"></i> 會員設定
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/member/orderHistory" class="nav-link">
              <i class="bi-wallet me-2"></i> 訂單紀錄
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/reservationrecords" class="nav-link">
              <i class="bi-fork-knife me-2"></i> 訂位紀錄
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/cart" class="nav-link">
              <i class="bi-cart-plus me-2"></i> 購物車
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/lookHistory/lookHistory" class="nav-link">
              <i class="bi-search me-2"></i> 瀏覽紀錄
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">
              <i class="bi-messenger me-2"></i> 評論紀錄
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/member/favorite" class="nav-link">
              <i class="bi-search-heart me-2"></i> 我的收藏
            </RouterLink>
          </li>
          <li class="nav-item">
            <a href="/customerServiceRecord" class="nav-link">
              <i class="bi-question-circle me-2"></i> 客服中心
            </a>
          </li>
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">
              <i class="bi-house me-2"></i> 回首頁
            </RouterLink>
          </li>
          <li class="nav-item border-top mt-auto pt-2">
            <RouterLink to="/logout" class="nav-link">
              <i class="bi-box-arrow-left me-2"></i> Logout
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Main content -->
      <main class="main-content flex-grow-1">
        <div class="title-group mb-3">
          <h1 class="h2 mb-0">Setting</h1>
        </div>

        <div class="row my-4">
          <!-- Left form -->
          <div class="col-lg-7 col-12">
            <div class="custom-block bg-white">
              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="profile-tab" data-bs-toggle="tab"
                    data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane"
                    aria-selected="true">Profile</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="password-tab" data-bs-toggle="tab" data-bs-target="#password-tab-pane"
                    type="button" role="tab" aria-controls="password-tab-pane" aria-selected="false">Password</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="notification-tab" data-bs-toggle="tab"
                    data-bs-target="#notification-tab-pane" type="button" role="tab"
                    aria-controls="notification-tab-pane" aria-selected="false">Notification</button>
                </li>
              </ul>

              <div class="tab-content" id="myTabContent">

                <!-- Profile Tab -->
                <div class="tab-pane fade show active" id="profile-tab-pane" role="tabpanel"
                  aria-labelledby="profile-tab" tabindex="0">
                  <h6 class="mb-4">User Profile</h6>

                  <form @submit.prevent="submitProfile" enctype="multipart/form-data">
                    <input type="hidden" :value="member.memberId" name="memberId" />
                    <input type="hidden" :value="member.user.accountId" name="accountId" />

                    <!-- Avatar -->
                    <div class="mb-3 text-center">
                      <img :src="avatarPreview" alt="會員頭像" id="avatarPreview" width="120" height="120"
                        class="rounded-circle mb-2" style="object-fit: cover;">
                      <input type="file" class="form-control mt-2" @change="onAvatarChange" accept="image/*">
                      <small class="text-muted d-block mt-2">最大1MB，支援 .PNG, .JPEG</small>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">姓名</label>
                      <input v-model="member.userName" type="text" class="form-control" required />
                    </div>

                    <div class="mb-3">
                      <label class="form-label d-block">性別</label>
                      <div>
                        <label><input type="radio" value="男" v-model="member.gender"> 男</label>
                        <label class="ms-3"><input type="radio" value="女" v-model="member.gender"> 女</label>
                        <label class="ms-3"><input type="radio" value="其他" v-model="member.gender"> 其他</label>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">生日</label>
                      <input type="date" class="form-control" v-model="member.birthdate">
                    </div>

                    <div class="mb-3">
                      <label class="form-label">電話</label>
                      <input type="tel" class="form-control" v-model="member.phone" pattern="^09\d{8}$" maxlength="10"
                        placeholder="請輸入手機號碼，例如：0912345678" required />
                    </div>


                    <div class="mb-3">
                      <label class="form-label">縣市</label>
                      <v-select append-to-body label="city" placeholder="請選擇縣市" :options="cities"
                        v-model="selectedCity" />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">區域</label>
                      <v-select append-to-body label="name" placeholder="請選擇區域" :options="districts"
                        v-model="selectedDistrict" :disabled="districts.length === 0" />
                    </div>



                    <div class="d-flex">
                      <button type="reset" class="form-control me-3" @click.prevent="resetProfile">Reset</button>
                      <button type="submit" class="form-control ms-2">Update</button>
                    </div>
                  </form>
                </div>

                <!-- Password Tab -->
                <div class="tab-pane fade" id="password-tab-pane" role="tabpanel" tabindex="0">
                  <h6 class="mb-4">Password</h6>

                  <form @submit.prevent="updatePassword">
                    <input v-model="passwordForm.password" type="password" class="form-control mb-2"
                      placeholder="Current Password" required>
                    <input v-model="passwordForm.newPassword" type="password" class="form-control mb-2"
                      placeholder="New Password" required>
                    <input v-model="passwordForm.confirmPassword" type="password" class="form-control mb-3"
                      placeholder="Confirm Password" required>

                    <div class="d-flex">
                      <button type="reset" class="form-control me-3 flex-grow-1"
                        @click.prevent="resetPasswordForm">Reset</button>
                      <button type="submit" class="form-control ms-2 flex-grow-1">Update Password</button>
                    </div>
                  </form>
                </div>

                <!-- Notification Tab -->
                <div class="tab-pane fade" id="notification-tab-pane" role="tabpanel" tabindex="0">
                  <h6 class="mb-4">Notification</h6>
                  <form @submit.prevent="saveNotification">
                    <div class="form-check form-switch d-flex mb-3 ps-0">
                      <label class="form-check-label">Account activity</label>
                      <input class="form-check-input ms-auto" type="checkbox" v-model="notification.accountActivity">
                    </div>
                    <div class="form-check form-switch d-flex mb-3 ps-0">
                      <label class="form-check-label">Payment updated</label>
                      <input class="form-check-input ms-auto" type="checkbox" v-model="notification.paymentUpdated">
                    </div>
                    <div class="d-flex">
                      <button type="reset" class="form-control me-3 flex-grow-1"
                        @click.prevent="resetNotification">Reset</button>
                      <button type="submit" class="form-control ms-2 flex-grow-1">Save</button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>

          <!-- Right Help -->
          <div class="col-lg-5 col-12">
            <div class="custom-block custom-block-contact">
              <h6 class="mb-4">Need Help?</h6>
              <p>
                <strong>客服專線:</strong> <a href="tel:3052409671" class="ms-2">(60) 305-240-9671</a>
              </p>
              <a href="#" class="btn custom-btn custom-btn-bg-white mt-3">聯繫客服</a>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>

import { memberProfile } from '@/composables/member/memberProfile.js';

const {
  member, selectedCity, selectedDistrict, districts, avatarPreview,
  onAvatarChange, submitProfile, resetProfile, loading,
  passwordForm, resetPasswordForm, updatePassword,
  notification, resetNotification, saveNotification,
  cities
} = memberProfile();


</script>
