document.addEventListener('DOMContentLoaded', function() {
    // Authentication check
    const currentUser = JSON.parse(localStorage.getItem('absas_current_user'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Only admin can access finance
    if (currentUser.accountType !== 'admin') {
        alert('Access Denied: Only administrators can access finance management.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Initialize UI
    document.getElementById('userInfoSidebar').innerHTML = `
        <p class="user-name">${currentUser.fullName}</p>
        <p class="user-role">Administrator</p>
    `;

    function updateDateTime() {
        const now = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
        document.getElementById('dateTime').textContent = now.toLocaleString('en-US', options);
    }
    updateDateTime();
    setInterval(updateDateTime, 60000);

    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('absas_current_user');
            window.location.href = 'login.html';
        }
    });

    // Section names mapping
    const SECTIONS = {
        '1': 'MATTHEW', '2': 'MARK', '3': 'LUKE', '4': 'JOHN', '5': 'ACTS',
        '6': 'ROMANS', '7': 'GENESIS', '8': 'EXODUS', '9': 'LEVITICUS', '10': 'NUMBERS'
    };

    // Fee structure - Base tuition per semester
    const BASE_TUITION = {
        '1': 15000, '2': 15000, '3': 15000, '4': 15000, '5': 15000, '6': 15000,
        '7': 18000, '8': 18000, '9': 18000, '10': 18000
    };

    // Miscellaneous fees per semester
    const MISC_FEES = {
        '1': 3500, '2': 3500, '3': 3500, '4': 3500, '5': 3500, '6': 3500,
        '7': 4000, '8': 4000, '9': 4000, '10': 4000
    };

    // Calculate total semester fee
    function getTotalSemesterFee(grade) {
        return (BASE_TUITION[grade] || 0) + (MISC_FEES[grade] || 0);
    }

    // Initialize financial data
    function initializeFinancialData() {
        if (!localStorage.getItem('absas_finances')) {
            const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
            const finances = students.map(student => {
                const totalFees = getTotalSemesterFee(student.grade);
                return {
                    studentId: student.id,
                    studentName: `${student.firstName} ${student.lastName}`,
                    grade: student.grade,
                    tuitionFee: BASE_TUITION[student.grade] || 0,
                    miscFee: MISC_FEES[student.grade] || 0,
                    totalFees: totalFees,
                    amountPaid: 0,
                    balance: totalFees,
                    status: 'unpaid',
                    payments: []
                };
            });
            localStorage.setItem('absas_finances', JSON.stringify(finances));
        }

        if (!localStorage.getItem('absas_payments')) {
            localStorage.setItem('absas_payments', JSON.stringify([]));
        }
    }

    // Format currency
    function formatCurrency(amount) {
        return '₱' + parseFloat(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Calculate statistics
    function updateStatistics() {
        const finances = JSON.parse(localStorage.getItem('absas_finances') || '[]');
        
        let totalRevenue = 0;
        let collectedAmount = 0;
        let outstandingBalance = 0;
        let fullyPaidCount = 0;

        finances.forEach(f => {
            totalRevenue += f.totalFees;
            collectedAmount += f.amountPaid;
            outstandingBalance += f.balance;
            if (f.status === 'paid') fullyPaidCount++;
        });

        document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
        document.getElementById('collectedAmount').textContent = formatCurrency(collectedAmount);
        document.getElementById('outstandingBalance').textContent = formatCurrency(outstandingBalance);
        document.getElementById('fullyPaidCount').textContent = fullyPaidCount;
    }

    // Filter finances
    window.filterFinances = function() {
        const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
        const gradeFilter = document.getElementById('gradeFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const finances = JSON.parse(localStorage.getItem('absas_finances') || '[]');

        let filtered = finances.filter(f => {
            const matchesSearch = !searchTerm || 
                f.studentName.toLowerCase().includes(searchTerm) ||
                f.studentId.toLowerCase().includes(searchTerm);
            const matchesGrade = !gradeFilter || f.grade === gradeFilter;
            const matchesStatus = !statusFilter || f.status === statusFilter;

            return matchesSearch && matchesGrade && matchesStatus;
        });

        displayFinances(filtered);
    };

    // Display financial records
    function displayFinances(finances) {
        const tbody = document.getElementById('financeTableBody');

        if (finances.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-message"><i class="fas fa-inbox" style="font-size: 48px; opacity: 0.3; display: block; margin-bottom: 10px;"></i>No financial records found</td></tr>';
            return;
        }

        tbody.innerHTML = finances.map(f => {
            let statusBadge = '';
            if (f.status === 'paid') {
                statusBadge = '<span class="payment-badge paid"><i class="fas fa-check-circle"></i> Fully Paid</span>';
            } else if (f.status === 'partial') {
                statusBadge = '<span class="payment-badge partial"><i class="fas fa-exclamation-circle"></i> Partial</span>';
            } else {
                statusBadge = '<span class="payment-badge unpaid"><i class="fas fa-times-circle"></i> Unpaid</span>';
            }

            return `
                <tr>
                    <td><strong>${f.studentId}</strong></td>
                    <td><strong>${f.studentName}</strong></td>
                    <td><span class="badge badge-info">Grade ${f.grade}</span></td>
                    <td class="amount-cell">${formatCurrency(f.totalFees)}</td>
                    <td class="amount-cell success">${formatCurrency(f.amountPaid)}</td>
                    <td class="amount-cell ${f.balance > 0 ? 'danger' : 'success'}">${formatCurrency(f.balance)}</td>
                    <td>${statusBadge}</td>
                    <td style="white-space: nowrap;">
                        <button class="btn btn-sm btn-primary" onclick="openPaymentModalForStudent('${f.studentId}')" title="Add Payment">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="viewStatement('${f.studentId}')" title="View Statement">
                            <i class="fas fa-file-invoice"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Load all finances
    function loadFinances() {
        const finances = JSON.parse(localStorage.getItem('absas_finances') || '[]');
        displayFinances(finances);
        updateStatistics();
    }

    // Open payment modal
    window.openPaymentModal = function() {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const selectElement = document.getElementById('paymentStudent');
        
        selectElement.innerHTML = '<option value="">-- Select Student --</option>';
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.id} - ${student.firstName} ${student.lastName} (Grade ${student.grade})`;
            selectElement.appendChild(option);
        });

        // Set today's date
        document.getElementById('paymentDate').valueAsDate = new Date();
        
        document.getElementById('paymentForm').reset();
        document.getElementById('studentBalanceInfo').style.display = 'none';
        document.getElementById('paymentModal').classList.add('active');
    };

    window.openPaymentModalForStudent = function(studentId) {
        openPaymentModal();
        document.getElementById('paymentStudent').value = studentId;
        loadStudentBalance();
    };

    window.closePaymentModal = function() {
        document.getElementById('paymentModal').classList.remove('active');
    };

    // Load student balance
    window.loadStudentBalance = function() {
        const studentId = document.getElementById('paymentStudent').value;
        
        if (!studentId) {
            document.getElementById('studentBalanceInfo').style.display = 'none';
            return;
        }

        const finances = JSON.parse(localStorage.getItem('absas_finances') || '[]');
        const studentFinance = finances.find(f => f.studentId === studentId);

        if (studentFinance) {
            const infoHTML = `
                <h4 style="color: var(--maroon); margin-bottom: 15px;">Fee Breakdown</h4>
                <div style="display: grid; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd;">
                        <span>Tuition Fee:</span>
                        <strong>${formatCurrency(studentFinance.tuitionFee)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd;">
                        <span>Miscellaneous Fee:</span>
                        <strong>${formatCurrency(studentFinance.miscFee)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 2px solid var(--maroon);">
                        <strong>Total Semester Fee:</strong>
                        <strong>${formatCurrency(studentFinance.totalFees)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; background: #d4edda; margin-top: 10px; padding: 10px; border-radius: 6px;">
                        <span style="color: #155724;">Amount Paid:</span>
                        <strong style="color: #155724;">${formatCurrency(studentFinance.amountPaid)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: ${studentFinance.balance > 0 ? '#f8d7da' : '#d4edda'}; border-radius: 6px; margin-top: 5px;">
                        <strong style="color: ${studentFinance.balance > 0 ? '#721c24' : '#155724'};">Outstanding Balance:</strong>
                        <strong style="color: ${studentFinance.balance > 0 ? '#dc3545' : '#28a745'}; font-size: 20px;">${formatCurrency(studentFinance.balance)}</strong>
                    </div>
                </div>
            `;
            
            document.getElementById('studentBalanceInfo').innerHTML = infoHTML;
            document.getElementById('studentBalanceInfo').style.display = 'block';
        }
    };

    // Save payment
    window.savePayment = function() {
        const form = document.getElementById('paymentForm');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const studentId = form.elements.studentId.value;
        const amount = parseFloat(form.elements.amount.value);
        const paymentDate = form.elements.paymentDate.value;
        const paymentMethod = form.elements.paymentMethod.value;
        const paymentFor = form.elements.paymentFor.value;
        const reference = form.elements.reference.value;
        const remarks = form.elements.remarks.value;

        // Get finances
        const finances = JSON.parse(localStorage.getItem('absas_finances') || '[]');
        const financeIndex = finances.findIndex(f => f.studentId === studentId);

        if (financeIndex === -1) {
            alert('Student finance record not found.');
            return;
        }

        const studentFinance = finances[financeIndex];

        // Validate amount
        if (amount <= 0) {
            alert('Payment amount must be greater than zero.');
            return;
        }

        if (amount > studentFinance.balance) {
            if (!confirm(`Payment amount (${formatCurrency(amount)}) exceeds balance (${formatCurrency(studentFinance.balance)}). Continue with overpayment?`)) {
                return;
            }
        }

        // Create payment record
        const payment = {
            id: 'PAY-' + Date.now(),
            studentId: studentId,
            amount: amount,
            date: paymentDate,
            method: paymentMethod,
            paymentFor: paymentFor,
            reference: reference,
            remarks: remarks,
            recordedBy: currentUser.fullName,
            recordedAt: new Date().toISOString()
        };

        // Update finance record
        studentFinance.amountPaid += amount;
        studentFinance.balance = studentFinance.totalFees - studentFinance.amountPaid;
        
        // Update status
        if (studentFinance.balance <= 0) {
            studentFinance.status = 'paid';
        } else if (studentFinance.amountPaid > 0) {
            studentFinance.status = 'partial';
        } else {
            studentFinance.status = 'unpaid';
        }

        studentFinance.payments.push(payment);
        finances[financeIndex] = studentFinance;

        // Save all payments
        const allPayments = JSON.parse(localStorage.getItem('absas_payments') || '[]');
        allPayments.push(payment);

        localStorage.setItem('absas_finances', JSON.stringify(finances));
        localStorage.setItem('absas_payments', JSON.stringify(allPayments));

        closePaymentModal();
        loadFinances();
        filterFinances();

        alert(`Payment of ${formatCurrency(amount)} successfully recorded for ${studentFinance.studentName}.\n\nRemaining Balance: ${formatCurrency(studentFinance.balance)}`);
    };

    // View statement of account
    window.viewStatement = function(studentId) {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const finances = JSON.parse(localStorage.getItem('absas_finances') || '[]');
        
        const student = students.find(s => s.id === studentId);
        const finance = finances.find(f => f.studentId === studentId);

        if (!student || !finance) {
            alert('Student or finance record not found.');
            return;
        }

        let statementHTML = `
            <div class="statement-container">
                <div class="statement-header">
                    <h2>A.B. SIMPSON ALLIANCE SCHOOL INC.</h2>
                    <p>Zamboanga City, Philippines</p>
                    <h3>STATEMENT OF ACCOUNT</h3>
                    <p class="statement-date">As of ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>

                <div class="student-info-box">
                    <div class="info-row">
                        <span class="info-label">Student ID:</span>
                        <span class="info-value">${student.id}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Student Name:</span>
                        <span class="info-value">${student.firstName} ${student.lastName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Grade Level:</span>
                        <span class="info-value">Grade ${student.grade} - ${SECTIONS[student.grade]}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">School Year:</span>
                        <span class="info-value">2024-2025 (Per Semester)</span>
                    </div>
                </div>

                <table class="statement-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tuition Fee</td>
                            <td class="amount-cell">${formatCurrency(finance.tuitionFee)}</td>
                        </tr>
                        <tr>
                            <td>Miscellaneous Fee</td>
                            <td class="amount-cell">${formatCurrency(finance.miscFee)}</td>
                        </tr>
                        <tr style="background: #f8f9fa; font-weight: 600;">
                            <td><strong>Total Semester Fees</strong></td>
                            <td class="amount-cell"><strong>${formatCurrency(finance.totalFees)}</strong></td>
                        </tr>
                        <tr class="success-row">
                            <td><strong>Total Amount Paid</strong></td>
                            <td class="amount-cell success">${formatCurrency(finance.amountPaid)}</td>
                        </tr>
                        <tr class="balance-row">
                            <td><strong>Outstanding Balance</strong></td>
                            <td class="amount-cell ${finance.balance > 0 ? 'danger' : 'success'}">${formatCurrency(finance.balance)}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="payment-history">
                    <h4><i class="fas fa-history"></i> Payment History</h4>
        `;

        if (finance.payments && finance.payments.length > 0) {
            statementHTML += `
                <table class="statement-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Payment For</th>
                            <th>Method</th>
                            <th>Reference</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            finance.payments.forEach(payment => {
                statementHTML += `
                    <tr>
                        <td>${new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>${payment.paymentFor}</td>
                        <td>${payment.method}</td>
                        <td>${payment.reference || '-'}</td>
                        <td class="amount-cell">${formatCurrency(payment.amount)}</td>
                    </tr>
                `;
            });

            statementHTML += `
                    </tbody>
                </table>
            `;
        } else {
            statementHTML += '<p style="text-align: center; color: #666; padding: 20px; background: #f8f9fa; border-radius: 8px;"><i class="fas fa-info-circle"></i> No payment records found. Please make your first payment.</p>';
        }

        statementHTML += `
                </div>

                <div class="statement-footer">
                    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <p style="margin: 0; color: #856404; font-size: 13px;">
                            <i class="fas fa-info-circle"></i> <strong>Note:</strong> Payments may be made in installments. Additional fees for books, uniforms, and other materials are billed separately.
                        </p>
                    </div>
                    <p style="font-size: 12px; color: #666; text-align: center; margin-top: 30px;">
                        This is a computer-generated statement. For inquiries, please contact the Finance Office.
                    </p>
                    <p style="font-size: 11px; color: #999; text-align: center;">
                        Document ID: SOA-${studentId}-${Date.now()}
                    </p>
                </div>
            </div>
        `;

        document.getElementById('statementContent').innerHTML = statementHTML;
        document.getElementById('statementModal').classList.add('active');
    };

    window.closeStatementModal = function() {
        document.getElementById('statementModal').classList.remove('active');
    };

    // Print statement
    window.printStatement = function() {
        const printContent = document.getElementById('statementContent').innerHTML;
        const printWindow = window.open('', '', 'height=800,width=800');
        
        printWindow.document.write(`
            <html>
            <head>
                <title>Statement of Account</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Poppins', sans-serif; margin: 20px; }
                    .statement-container { max-width: 800px; margin: 0 auto; }
                    .statement-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #800000; padding-bottom: 15px; }
                    .statement-header h2 { color: #800000; margin: 0; font-size: 20px; }
                    .statement-header h3 { color: #FFD700; margin: 10px 0; }
                    .student-info-box { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                    .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                    .info-label { font-weight: 600; color: #800000; }
                    .statement-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                    .statement-table th, .statement-table td { border: 1px solid #ddd; padding: 10px; }
                    .statement-table th { background: #800000; color: white; }
                    .amount-cell { text-align: right; font-weight: 600; }
                    .balance-row { background: #fff3cd; font-size: 16px; }
                    .success-row { background: #d4edda; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>${printContent}</body>
            </html>
        `);
        
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    // Generate financial report
    window.generateFinancialReport = function() {
        const finances = JSON.parse(localStorage.getItem('absas_finances') || '[]');
        
        let totalRevenue = 0;
        let collected = 0;
        let outstanding = 0;

        let reportHTML = `
            <div class="report-container">
                <h3 style="color: var(--maroon); margin-bottom: 20px;"><i class="fas fa-chart-bar"></i> Financial Summary Report</h3>
                <p style="margin-bottom: 20px;">Generated: ${new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                <p style="margin-bottom: 20px; padding: 10px; background: #e7f3ff; border-left: 4px solid #007bff; border-radius: 6px;">
                    <i class="fas fa-info-circle"></i> <strong>Note:</strong> All amounts shown are per semester fees. Additional charges for books, uniforms, and materials are billed separately.
                </p>
        `;

        // Summary by grade
        const gradeMap = {};
        finances.forEach(f => {
            if (!gradeMap[f.grade]) {
                gradeMap[f.grade] = { count: 0, totalFees: 0, collected: 0, outstanding: 0 };
            }
            gradeMap[f.grade].count++;
            gradeMap[f.grade].totalFees += f.totalFees;
            gradeMap[f.grade].collected += f.amountPaid;
            gradeMap[f.grade].outstanding += f.balance;

            totalRevenue += f.totalFees;
            collected += f.amountPaid;
            outstanding += f.balance;
        });

        reportHTML += '<table class="data-table" style="margin: 20px 0;"><thead><tr><th>Grade</th><th>Students</th><th>Total Fees</th><th>Collected</th><th>Outstanding</th><th>Collection %</th></tr></thead><tbody>';

        Object.keys(gradeMap).sort().forEach(grade => {
            const data = gradeMap[grade];
            const collectionRate = data.totalFees > 0 ? ((data.collected / data.totalFees) * 100).toFixed(1) : '0.0';
            reportHTML += `
                <tr>
                    <td>Grade ${grade} - ${SECTIONS[grade]}</td>
                    <td>${data.count}</td>
                    <td>${formatCurrency(data.totalFees)}</td>
                    <td class="success">${formatCurrency(data.collected)}</td>
                    <td class="danger">${formatCurrency(data.outstanding)}</td>
                    <td><strong>${collectionRate}%</strong></td>
                </tr>
            `;
        });

        const overallCollectionRate = totalRevenue > 0 ? ((collected / totalRevenue) * 100).toFixed(1) : '0.0';

        reportHTML += `
            <tr style="background: var(--light-gray); font-weight: 700;">
                <td>TOTAL</td>
                <td>${finances.length}</td>
                <td>${formatCurrency(totalRevenue)}</td>
                <td class="success">${formatCurrency(collected)}</td>
                <td class="danger">${formatCurrency(outstanding)}</td>
                <td><strong>${overallCollectionRate}%</strong></td>
            </tr>
        `;

        reportHTML += '</tbody></table></div>';

        const modal = document.getElementById('statementModal');
        document.getElementById('statementContent').innerHTML = reportHTML;
        modal.classList.add('active');
    };

    // Export financial data
    window.exportFinancialData = function() {
        const finances = JSON.parse(localStorage.getItem('absas_finances') || '[]');
        
        if (finances.length === 0) {
            alert('No financial data to export.');
            return;
        }

        let csv = 'Student ID,Student Name,Grade,Section,Tuition Fee,Misc Fee,Total Fees,Amount Paid,Balance,Status\n';
        
        finances.forEach(f => {
            csv += `${f.studentId},"${f.studentName}",${f.grade},${SECTIONS[f.grade]},${f.tuitionFee},${f.miscFee},${f.totalFees},${f.amountPaid},${f.balance},${f.status}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // View payment history
    window.viewPaymentHistory = function() {
        const payments = JSON.parse(localStorage.getItem('absas_payments') || '[]');
        
        let historyHTML = `
            <div class="payment-history-container">
                <h3 style="color: var(--maroon); margin-bottom: 20px;"><i class="fas fa-history"></i> Recent Payment History</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Student ID</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Payment For</th>
                            <th>Recorded By</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        if (payments.length === 0) {
            historyHTML += '<tr><td colspan="6" class="empty-message">No payment records found</td></tr>';
        } else {
            // Show last 50 payments
            payments.slice(-50).reverse().forEach(payment => {
                historyHTML += `
                    <tr>
                        <td>${new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>${payment.studentId}</td>
                        <td class="amount-cell success">${formatCurrency(payment.amount)}</td>
                        <td>${payment.method}</td>
                        <td>${payment.paymentFor}</td>
                        <td>${payment.recordedBy}</td>
                    </tr>
                `;
            });
        }

        historyHTML += '</tbody></table></div>';

        document.getElementById('statementContent').innerHTML = historyHTML;
        document.getElementById('statementModal').classList.add('active');
    };

    // Initialize
    initializeFinancialData();
    loadFinances();
});