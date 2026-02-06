document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const incomeInput = document.getElementById('incomeGoal');
    const avgCheckInput = document.getElementById('avgCheck');
    const convRateInput = document.getElementById('convRate');

    // Toggles
    const crmYes = document.getElementById('crm-yes');
    const crmNo = document.getElementById('crm-no');
    const salesYes = document.getElementById('sales-yes');
    const salesNo = document.getElementById('sales-no');
    const smmYes = document.getElementById('smm-yes');
    const smmNo = document.getElementById('smm-no');

    // Outputs
    const clientsNeedEl = document.getElementById('clientsNeeded');
    const leadsNeedEl = document.getElementById('leadsNeeded');
    const minBudgetEl = document.getElementById('minBudget');
    const optBudgetEl = document.getElementById('optBudget');
    const budgetPenaltyEl = document.getElementById('budgetPenalty');
    const warningListEl = document.getElementById('warningList');
    const recommendationsListEl = document.getElementById('recommendationsList');
    const riskChartEl = document.getElementById('riskChart');
    const riskTextEl = document.querySelector('.risk-meter .percentage');

    // Icon Status
    const iconCrm = document.getElementById('icon-crm');
    const iconSales = document.getElementById('icon-sales');
    const iconSmm = document.getElementById('icon-smm');

    // Constants
    const CPL_MIN = 0.8; // $
    const CPL_MAX = 1.5; // $

    function calculate() {
        // Get Values
        let incomeStr = incomeInput.value;
        let avgCheckStr = avgCheckInput.value;
        let convRateStr = convRateInput.value;

        // If any input is empty, reset results and stop
        if (!incomeStr || !avgCheckStr || !convRateStr) {
            clientsNeedEl.textContent = '---';
            leadsNeedEl.textContent = '---';
            minBudgetEl.textContent = '---';
            optBudgetEl.textContent = '---';
            budgetPenaltyEl.textContent = 'KUTILMOQDA...';
            warningListEl.innerHTML = '<li>⚠️ Ma\'lumotlarni kiriting...</li>';
            document.querySelector('.impact-alert').style.display = 'none';
            return;
        }

        let income = parseFloat(incomeStr);
        let avgCheck = parseFloat(avgCheckStr);
        let convRate = parseFloat(convRateStr);

        let hasCRM = crmYes.checked;
        let hasSales = salesYes.checked;
        let hasSMM = smmYes.checked;

        // Core Calculation
        if (income === 0 || avgCheck === 0 || convRate === 0) return;

        let clientsNeeded = income / avgCheck;
        // convRate is percent, so / 100
        let leadsNeeded = clientsNeeded / (convRate / 100);

        // Penalties
        let penalty = 0;
        let warnings = [];
        let recommendations = [];

        if (!hasCRM) {
            penalty += 0.20;
            warnings.push(`🔥 CRM yo'q - Mijozlar nazoratsiz qolmoqda (+20% Zarar)`);
            recommendations.push(`CRM tizimi (AmoCRM/Bitrix24) o'rnating`);
            iconCrm.textContent = '❌';
        } else {
            iconCrm.textContent = '✅';
        }

        if (!hasSales) {
            penalty += 0.20;
            warnings.push(`💀 Sotuvchisiz biznes - bu shunchaki xobbi (+20% Zarar)`);
            recommendations.push(`Professional Sotuvchi yollang`);
            iconSales.textContent = '❌';
        } else {
            iconSales.textContent = '✅';
        }

        if (!hasSMM) {
            penalty += 0.10;
            warnings.push(`📉 Ijtimoiy tarmoq o'lik - Ishonch yo'q (+10%)`);
            recommendations.push(`Instagramni "Upakovka" qiling!`);
            iconSmm.textContent = '❌';
        } else {
            iconSmm.textContent = '✅';
        }

        // Always add test budget recommendation
        recommendations.push(`Reklamaga $100 tashlab test qiling`);

        // Budget Calc
        let baseMinBudget = leadsNeeded * CPL_MIN;
        let baseOptBudget = leadsNeeded * CPL_MAX;

        let finalMinBudget = baseMinBudget * (1 + penalty);
        let finalOptBudget = baseOptBudget * (1 + penalty);

        // Update UI
        clientsNeedEl.textContent = Math.ceil(clientsNeeded);
        leadsNeedEl.textContent = Math.ceil(leadsNeeded);

        // Format Currency
        const fmt = (num) => '$' + Math.ceil(num).toLocaleString();

        minBudgetEl.textContent = fmt(finalMinBudget);
        optBudgetEl.textContent = fmt(finalOptBudget);
        budgetPenaltyEl.textContent = "SAMARASIZLIK: " + Math.round(penalty * 100) + '%';

        // Update Warnings
        if (warnings.length === 0) {
            warningListEl.innerHTML = '<li>✅ BIZNESINGIZ MUKAMMAL! NAVBATDAGI BOSQICHGA O\'TING.</li>';
            document.querySelector('.impact-alert').style.display = 'none';
        } else {
            warningListEl.innerHTML = warnings.map(w => `<li>${w}</li>`).join('');
            document.querySelector('.impact-alert').style.display = 'block';
            document.querySelector('.impact-alert').innerHTML = `DIQQAT! TIZIMSIZLIK SABAB <span style="color:#fff; font-weight:800;">${Math.round(penalty * 100)}%</span> PULINGIZ KUYMOQDA!`;
        }

        // Update Recommendations
        recommendationsListEl.innerHTML = recommendations.map(r => `<div class="chip">${r}</div>`).join('');

        // Update Risk visualization
        updateRisk(penalty);
    }

    function updateRisk(penalty) {
        // Penalty 0 - 0.4
        // 0 -> Low Risk (Green)
        // 0.2 -> Medium Risk (Yellow)
        // 0.4+ -> High Risk (Red)

        riskChartEl.classList.remove('green', 'yellow', 'red');
        let riskLabel = "";
        let strokeDash = 0; // 0 to 100

        if (penalty >= 0.4) {
            riskChartEl.classList.add('red');
            riskLabel = "KRITIK<br>HOLAT";
            strokeDash = 85;
        } else if (penalty >= 0.2) {
            riskChartEl.classList.add('yellow');
            riskLabel = "XAVFLI";
            strokeDash = 55;
        } else {
            riskChartEl.classList.add('green');
            riskLabel = "IDEAL";
            strokeDash = 100; // Full circle
        }

        riskTextEl.innerHTML = riskLabel;
        // Simple animation for the stroke
        const circle = riskChartEl.querySelector('.circle');
        circle.setAttribute('stroke-dasharray', `${strokeDash}, 100`);
    }

    // Attach Listeners
    const inputs = [incomeInput, avgCheckInput, convRateInput];
    const toggles = [crmYes, crmNo, salesYes, salesNo, smmYes, smmNo];

    inputs.forEach(el => el.addEventListener('input', calculate));
    toggles.forEach(el => el.addEventListener('change', calculate));

    // Tilt Effect
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set mouse position for glow effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Tilt calc
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Normalize -1 to 1
            const rotateX = ((y - centerY) / centerY) * -2; // Max 2deg
            const rotateY = ((x - centerX) / centerX) * 2;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Initial run
    calculate();
});
