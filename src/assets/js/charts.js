// charts.js
import ApexCharts from "apexcharts";

export async function renderAccountCharts(roleElId, statusElId, API_BASE_URL) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/accounts/list`);
        const data = await res.json();
        const users = data.content || [];

        // 計算角色
        const roleCount = { admin: 0, member: 0, vendor: 0 };
        // 計算狀態
        const statusCount = { test: 0, active: 0, inactive: 0, blocked: 0 };

        users.forEach(user => {
            const roleId = user.userId?.id;
            switch (Number(roleId)) {
                case 1: roleCount.admin++; break;
                case 2: roleCount.member++; break;
                case 3: roleCount.vendor++; break;
            }

            switch (Number(user.status)) {
                case 0: statusCount.test++; break;
                case 1: statusCount.active++; break;
                case 2: statusCount.inactive++; break;
                case 3: statusCount.blocked++; break;
            }
        });

        // Donut: 角色統計
        const roleOptions = {
            chart: {
                type: 'donut',
                width: '100%',
            },
            series: [roleCount.admin, roleCount.member, roleCount.vendor],
            labels: ['管理員', '會員', '廠商'],
            colors: ['#0d6efd', '#60bdf3ff', '#ffc107'],
            legend: { position: 'bottom' },
            title: {
                text: '帳號角色統計',
                align: 'center',
                style: { fontSize: '16px', fontFamily: 'Unbounded, sans-serif', fontWeight: '700' }
            },
            responsive: [
                { breakpoint: 480, options: { chart: { height: 250 }, legend: { position: 'bottom' } } }
            ]
        };

        new ApexCharts(document.querySelector(`#${roleElId}`), roleOptions).render();


        // Bar: 狀態統計
        const statusOptions = {
            chart: { type: 'bar', width: '100%' },
            series: [{ name: "帳號數量", data: [statusCount.test, statusCount.active, statusCount.inactive, statusCount.blocked] }],
            xaxis: { categories: ["測試用", "啟用", "停用", "黑名單"], labels: { style: { fontSize: '12px', fontFamily: 'Unbounded, sans-serif' } } },
            yaxis: { title: { text: '帳號狀態', style: { fontSize: '14px', fontFamily: 'Unbounded, sans-serif' } } },
            colors: ['#000000ff', '#198754', '#646464ff', '#dc3545'],
            dataLabels: { enabled: true, style: { fontSize: '12px', fontFamily: 'Unbounded, sans-serif' } },
            legend: { show: false },
            plotOptions: { bar: { distributed: true, borderRadius: 4 } },
            responsive: [{ breakpoint: 480, options: { chart: { height: 250 } } }]
        };
        new ApexCharts(document.querySelector(`#${statusElId}`), statusOptions).render();

        return { roleCount, statusCount };
    } catch (err) {
        console.error("抓取帳號資料失敗:", err);
    }
}
