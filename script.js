/**
 * BiznesAudit Pro — Asosiy JavaScript Mantiq
 * UI/UX Pro Max Skill qoidalariga mos tarzda qayta yozilgan
 */

/* ------------------------------------------------------------------
   Dark Mode Toggle (runs immediately on load, before DOMContentLoaded)
   ------------------------------------------------------------------ */
(function initThemeToggle() {
    const html = document.documentElement;
    const btn = document.getElementById('themeToggle');

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (btn) {
            btn.setAttribute(
                'aria-label',
                theme === 'dark' ? 'Yorug\' rejimga o\'tish' : 'Qorong\'u rejimga o\'tish'
            );
        }
    }

    // Init from localStorage or system preference
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));

    // Listen for button click
    if (btn) {
        btn.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // Listen for OS-level preference change (when no manual override)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
})();

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------
       1. DOM References
       ------------------------------------------------------------------ */
    const incomeInput = document.getElementById('incomeGoal');
    const avgCheckInput = document.getElementById('avgCheck');
    const convRateInput = document.getElementById('convRate');

    const clientsNeedEl = document.getElementById('clientsNeeded');
    const leadsNeedEl = document.getElementById('leadsNeeded');
    const minBudgetEl = document.getElementById('minBudget');
    const optBudgetEl = document.getElementById('optBudget');

    const donutRing = document.getElementById('donutRing');
    const riskPercent = document.getElementById('riskPercent');
    const riskLabel = document.getElementById('riskLabel');

    const impactAlert = document.getElementById('impactAlert');
    const impactText = document.getElementById('impactText');
    const recsList = document.getElementById('recommendationsList');

    const statusCrmEl = document.getElementById('status-crm');
    const statusSalesEl = document.getElementById('status-sales');
    const statusSmmEl = document.getElementById('status-smm');

    const allRadios = document.querySelectorAll('input[type="radio"]');

    /* ------------------------------------------------------------------
       2. Constants
       ------------------------------------------------------------------ */
    const CPL_MIN = 0.8;
    const CPL_MAX = 1.5;

    // Donut dimensions
    const DONUT_R = 46;
    const DONUT_C = 2 * Math.PI * DONUT_R; // ~289px

    /* ------------------------------------------------------------------
       3. Helpers
       ------------------------------------------------------------------ */
    function getRadioValue(name) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : null;
    }

    function fmt(num) {
        return num.toLocaleString('en-US');
    }

    function fmtMoney(num) {
        return '$' + fmt(Math.ceil(num));
    }

    /* ------------------------------------------------------------------
       4. Status Row Updater
       ------------------------------------------------------------------ */
    function setStatusRow(el, isGood, goodDesc, badDesc) {
        const indicator = el.querySelector('.status-indicator');
        const desc = el.querySelector('.status-desc');
        const svgPath = el.querySelector('.status-indicator svg');

        indicator.className = 'status-indicator ' + (isGood ? 'status-indicator--good' : 'status-indicator--bad');

        if (isGood) {
            svgPath.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
        } else {
            svgPath.innerHTML = '<line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>';
        }

        desc.textContent = isGood ? goodDesc : badDesc;
    }

    /* ------------------------------------------------------------------
       5. Donut Chart Updater
       ------------------------------------------------------------------ */
    function updateDonut(penalty) {
        // 0 penalty = green (100%), 0.5+ = red (0%)
        const pct = Math.max(0, Math.min(1, 1 - (penalty / 0.5)));
        const fill = pct * DONUT_C;

        donutRing.style.strokeDasharray = `${fill} ${DONUT_C}`;

        // Remove previous state classes
        donutRing.classList.remove('state-safe', 'state-medium', 'state-danger');

        let label, stateClass, percentText;

        if (penalty === 0) {
            stateClass = 'state-safe';
            label = 'XAVFSIZ';
            percentText = '100%';
        } else if (penalty < 0.3) {
            stateClass = 'state-medium';
            label = "O'RTA";
            percentText = Math.round(pct * 100) + '%';
        } else {
            stateClass = 'state-danger';
            label = 'KRITIK';
            percentText = Math.round(pct * 100) + '%';
        }

        donutRing.classList.add(stateClass);
        riskLabel.textContent = label;
        riskPercent.textContent = percentText;
    }

    function resetDonut() {
        donutRing.style.strokeDasharray = `0 ${DONUT_C}`;
        donutRing.classList.remove('state-safe', 'state-medium', 'state-danger');
        riskLabel.textContent = 'TAHLIL';
        riskPercent.textContent = '—';
    }

    /* ------------------------------------------------------------------
       6. Animated Number Counter
       ------------------------------------------------------------------ */
    function animateNumber(el, startVal, endVal, prefix = '', suffix = '', duration = 600) {
        const start = performance.now();
        const range = endVal - startVal;

        function step(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startVal + range * eased);
            el.textContent = prefix + fmt(current) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    /* ------------------------------------------------------------------
       7. Recommendations Builder
       ------------------------------------------------------------------ */
    const REC_TEMPLATES = {
        crm: {
            type: 'danger',
            title: 'CRM tizimini o\'rnatish',
            desc: 'Mijozlarni yo\'qotish xavfini 30-50% kamaytiradi',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`
        },
        sales: {
            type: 'danger',
            title: 'Sotuv menejeri yollash',
            desc: 'Konversiyani 2-3 baravar oshirish imkoniyati',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
        },
        smm: {
            type: 'warning',
            title: 'SMM va target reklama',
            desc: 'Organik va pullik traffic aralashmasini optimallashtirish',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`
        },
        test: {
            type: 'default',
            title: 'Reklama byudjetini test qilish ($100)',
            desc: 'A/B test orqali eng samarali kanallarni aniqlash',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`
        }
    };

    function buildRecItem(key, delay) {
        const t = REC_TEMPLATES[key];
        const div = document.createElement('div');
        div.className = `rec-item rec-item--${t.type}`;
        div.setAttribute('role', 'listitem');
        div.style.animationDelay = `${delay}ms`;
        div.innerHTML = `
            <div class="rec-priority rec-priority--${t.type}">${t.icon}</div>
            <div class="rec-text">
                <div class="rec-title">${t.title}</div>
                <div class="rec-desc">${t.desc}</div>
            </div>
            <div class="rec-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
        `;
        return div;
    }

    /* ------------------------------------------------------------------
       8. Main Calculate Function
       ------------------------------------------------------------------ */
    function calculate() {
        const income = parseFloat(incomeInput.value) || 0;
        const avgCheck = parseFloat(avgCheckInput.value) || 0;
        const convRate = parseFloat(convRateInput.value) || 0;

        const hasCrm = getRadioValue('crm') === 'yes';
        const hasSales = getRadioValue('sales') === 'yes';
        const hasSmm = getRadioValue('smm') === 'yes';

        // Update status rows
        setStatusRow(statusCrmEl, hasCrm, 'Faol va ishlayapti', 'Mijozlar yo\'qolish ehtimoli');
        setStatusRow(statusSalesEl, hasSales, 'Menejerlar faol', 'Konversiya past qoladi');
        setStatusRow(statusSmmEl, hasSmm, 'Aktiv va ishlayapti', 'Traffic kanal yo\'q');

        if (income > 0 && avgCheck > 0 && convRate > 0) {

            // Core calculations
            const clientsNeeded = income / avgCheck;
            const leadsNeeded = clientsNeeded / (convRate / 100);

            // Animate KPI numbers
            animateNumber(clientsNeedEl, 0, Math.ceil(clientsNeeded));
            animateNumber(leadsNeedEl, 0, Math.ceil(leadsNeeded));

            // Penalty calculation
            let penalty = 0;
            const recKeys = [];

            if (!hasCrm) { penalty += 0.2; recKeys.push('crm'); }
            if (!hasSales) { penalty += 0.2; recKeys.push('sales'); }
            if (!hasSmm) { penalty += 0.1; recKeys.push('smm'); }
            recKeys.push('test');

            // Budget with penalty
            const finalMin = leadsNeeded * CPL_MIN * (1 + penalty);
            const finalOpt = leadsNeeded * CPL_MAX * (1 + penalty);

            animateNumber(minBudgetEl, 0, Math.ceil(finalMin), '$');
            animateNumber(optBudgetEl, 0, Math.ceil(finalOpt), '$');

            // Donut update
            updateDonut(penalty);

            // Alert
            if (penalty > 0) {
                impactAlert.style.display = 'flex';
                impactText.textContent = `Tizimdagi kamchiliklar tufayli reklama byudjetingiz ${Math.round(penalty * 100)}% ga ortmoqda.`;
            } else {
                impactAlert.style.display = 'none';
            }

            // Recommendations
            recsList.innerHTML = '';
            recKeys.forEach((key, i) => {
                recsList.appendChild(buildRecItem(key, i * 80));
            });

        } else {
            // Reset state
            clientsNeedEl.textContent = '—';
            leadsNeedEl.textContent = '—';
            minBudgetEl.textContent = '—';
            optBudgetEl.textContent = '—';

            resetDonut();
            impactAlert.style.display = 'none';

            recsList.innerHTML = `
                <div class="recs-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                    </svg>
                    <p>Ma'lumotlarni kiriting — tavsiyalar avtomatik ko'rinadi</p>
                </div>
            `;
        }
    }

    /* ------------------------------------------------------------------
       9. Event Listeners
       ------------------------------------------------------------------ */
    [incomeInput, avgCheckInput, convRateInput].forEach(inp => {
        inp.addEventListener('input', calculate);
    });

    allRadios.forEach(radio => {
        radio.addEventListener('change', calculate);
    });

    /* ------------------------------------------------------------------
       10. Initial Run
       ------------------------------------------------------------------ */
    calculate();
});
