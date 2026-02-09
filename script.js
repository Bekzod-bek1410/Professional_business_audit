document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const incomeInput = document.getElementById('incomeGoal');
    const avgCheckInput = document.getElementById('avgCheck');
    const convRateInput = document.getElementById('convRate');

    // Radios (using querySelector for groups)
    const radios = document.querySelectorAll('input[type="radio"]');

    // Outputs
    const clientsNeedEl = document.getElementById('clientsNeeded');
    const leadsNeedEl = document.getElementById('leadsNeeded');
    const minBudgetEl = document.getElementById('minBudget');
    const optBudgetEl = document.getElementById('optBudget');

    // Risk Elements
    const riskLabel = document.getElementById('riskLabel');
    const riskCircle = document.querySelector('.circular-chart .circle');

    // Alert & Recommendations
    const impactAlert = document.getElementById('impactAlert');
    const impactText = document.getElementById('impactText');
    const recommendationsList = document.getElementById('recommendationsList');

    // Constants
    const CPL_MIN = 0.8;
    const CPL_MAX = 1.5;

    function getRadioValue(name) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : null;
    }

    function calculate() {
        const income = parseFloat(incomeInput.value) || 0;
        const avgCheck = parseFloat(avgCheckInput.value) || 0;
        const convRate = parseFloat(convRateInput.value) || 0;

        // Status checks
        const owner = getRadioValue('owner') === 'yes';
        const crm = getRadioValue('crm') === 'yes';
        const sales = getRadioValue('sales') === 'yes';
        const smm = getRadioValue('smm') === 'yes';

        // --- Core Calculation ---
        if (income > 0 && avgCheck > 0 && convRate > 0) {
            const clientsNeeded = income / avgCheck;
            const leadsNeeded = clientsNeeded / (convRate / 100);

            clientsNeedEl.textContent = Math.ceil(clientsNeeded).toLocaleString();
            leadsNeedEl.textContent = Math.ceil(leadsNeeded).toLocaleString();

            // Calculate Penalty
            let penalty = 0;
            let risks = [];
            let recs = [];

            if (!crm) {
                penalty += 0.2;
                risks.push("CRM yo'qligi sababli mijozlar yo'qolmoqda.");
                recs.push({ text: "CRM Tizimini O'rnatish", type: "destructive" });
            }
            if (!sales) {
                penalty += 0.2;
                risks.push("Sotuv bo'limi yo'qligi konversiyani tushirmoqda.");
                recs.push({ text: "Sotuv Menejeri Yollash", type: "destructive" });
            }
            if (!smm) {
                penalty += 0.1;
                risks.push("Ijtimoiy tarmoqlar faol emas.");
                recs.push({ text: "SMM (Target) Yo'lga Qo'yish", type: "secondary" });
            }

            // Budget
            const baseMin = leadsNeeded * CPL_MIN;
            const baseOpt = leadsNeeded * CPL_MAX;
            const finalMin = baseMin * (1 + penalty);
            const finalOpt = baseOpt * (1 + penalty);

            minBudgetEl.textContent = '$' + Math.ceil(finalMin).toLocaleString();
            optBudgetEl.textContent = '$' + Math.ceil(finalOpt).toLocaleString();

            // Render Recommendations
            recs.push({ text: "Reklama Byudjetini Test Qilish ($100)", type: "outline" });
            recommendationsList.innerHTML = recs.map(r =>
                `<span class="badge badge-${r.type}">${r.text}</span>`
            ).join('');

            // Update Risk UI
            updateRiskUI(penalty);

            // Update Alert
            if (penalty > 0) {
                impactAlert.style.display = 'flex';
                impactText.textContent = `Tizimdagi kamchiliklar sababli byudjetingiz ${Math.round(penalty * 100)}% ga oshib ketmoqda.`;
            } else {
                impactAlert.style.display = 'none';
            }

        } else {
            // Reset if inputs incomplete
            clientsNeedEl.textContent = '---';
            leadsNeedEl.textContent = '---';
            minBudgetEl.textContent = '---';
            optBudgetEl.textContent = '---';
            riskLabel.textContent = "HISOBLANMOQDA";
            riskCircle.style.strokeDasharray = "0, 100";
            riskCircle.setAttribute('class', 'circle'); // reset colors
            recommendationsList.innerHTML = '';
            impactAlert.style.display = 'none';
        }
    }

    function updateRiskUI(penalty) {
        // 0 -> Green, 0.2 -> Yellow, >= 0.4 -> Red
        let colorClass = 'green';
        let label = 'XAVFSIZ';
        let stroke = 100;

        if (penalty >= 0.4) {
            colorClass = 'red';
            label = 'KRITIK';
            stroke = 75;
        } else if (penalty >= 0.1) {
            colorClass = 'yellow';
            label = 'O\'RTA';
            stroke = 50;
        }

        riskCircle.setAttribute('class', `circle ${colorClass}`);
        // Small timeout to trigger animation
        setTimeout(() => {
            riskCircle.style.strokeDasharray = `${stroke}, 100`;
        }, 50);

        riskLabel.innerHTML = `<span>${label}</span>`;
    }

    // Event Listeners
    [incomeInput, avgCheckInput, convRateInput].forEach(inp => {
        inp.addEventListener('input', calculate);
    });

    radios.forEach(r => {
        r.addEventListener('change', calculate);
    });

    // Run initially
    calculate();
});
