import { ref } from "vue";
import { defineStore } from "pinia";
import { useUserStore } from "./user";

export const useNotificationStore = defineStore("notification", () => {
  const userStore = useUserStore();

  // ==================== 商品審核通知 (店家專用) ====================
  const productNotifications = ref([]);
  const hasNewProductNotification = ref(false);

  // ==================== 訂位通知 (店家專用) ====================
  const reservationNotifications = ref([]);
  const hasNewReservationNotification = ref(false);

  // ==================== 統一通知旗標 ====================
  const hasNewNotification = ref(false);

  // ==================== WebSocket ====================
  let vendorSocket = null;

  function connectVendorWebSocket() {
    const vendorId = userStore.user?.vendor?.vendorId;

    if (!vendorId) {
      console.warn("⚠️ 無 vendorId，無法建立店家通知 WebSocket");
      return;
    }

    if (vendorSocket && vendorSocket.readyState === WebSocket.OPEN) {
      console.log("✅ 店家通知 WebSocket 已連線，略過");
      return;
    }

    vendorSocket = new WebSocket(`ws://localhost:8082/ws/vendor`);

    vendorSocket.onopen = () => {
      console.log("✅ 店家通知 WebSocket 連線成功！");
    };

    vendorSocket.onmessage = (event) => {
      let msgData;
      try {
        msgData = JSON.parse(event.data);
      } catch (e) {
        msgData = { message: event.data };
      }

      console.log("📩 收到店家通知：", msgData);

      const notification = {
        message: msgData.message || msgData.text || "無內容",
        date: new Date().toLocaleString(),
      };

      if (msgData.type === "product") {
        productNotifications.value.unshift(notification);
        hasNewProductNotification.value = true;
      } else if (msgData.type === "reservation") {
        reservationNotifications.value.unshift(notification);
        hasNewReservationNotification.value = true;
      } else {
        // 預設為商品通知
        productNotifications.value.unshift(notification);
        hasNewProductNotification.value = true;
      }

      // 更新統一通知旗標
      hasNewNotification.value = true;
    };

    vendorSocket.onclose = () => {
      console.log("❌ 店家通知 WebSocket 已關閉");
    };

    vendorSocket.onerror = (err) => {
      console.error("⚠️ 店家通知 WebSocket 錯誤：", err);
    };
  }

  function closeVendorWebSocket() {
    if (vendorSocket) {
      vendorSocket.close();
      vendorSocket = null;
      console.log("🔌 店家 WebSocket 已手動關閉");
    }
  }

  function connectAllVendorWebSockets() {
    if (userStore.roleId === 3) {
      connectVendorWebSocket();
      console.log("🏪 店家所有 WebSocket 連線完成");
    }
  }

  function closeAllVendorWebSockets() {
    closeVendorWebSocket();
    console.log("🔌 所有店家 WebSocket 已關閉");
  }

  // ==================== 清除旗標 / 資料 ====================
  function clearProductNotificationFlag() {
    hasNewProductNotification.value = false;
    updateGlobalFlag();
  }

  function clearReservationNotificationFlag() {
    hasNewReservationNotification.value = false;
    updateGlobalFlag();
  }

  function clearAllProductNotifications() {
    productNotifications.value = [];
    hasNewProductNotification.value = false;
    updateGlobalFlag();
  }

  function clearAllReservationNotifications() {
    reservationNotifications.value = [];
    hasNewReservationNotification.value = false;
    updateGlobalFlag();
  }

  function updateGlobalFlag() {
    hasNewNotification.value =
      hasNewProductNotification.value || hasNewReservationNotification.value;
  }

  function setNewNotification(value) {
    hasNewNotification.value = value;
  }

  return {
    // 商品通知
    productNotifications,
    hasNewProductNotification,
    clearProductNotificationFlag,
    clearAllProductNotifications,

    // 訂位通知
    reservationNotifications,
    hasNewReservationNotification,
    clearReservationNotificationFlag,
    clearAllReservationNotifications,

    // 統一通知
    hasNewNotification,
    setNewNotification,

    // WebSocket
    connectVendorWebSocket,
    closeVendorWebSocket,
    connectAllVendorWebSockets,
    closeAllVendorWebSockets,
  };
});
