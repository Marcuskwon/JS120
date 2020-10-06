
// 1 & 3 - I used the Object.assign instead of using mutiple tenary operators in LS solutions.
function createInvoice (services) {
  let invObj = {
    phone: 3000,
    internet: 5500,
    payments: [],
    total () {
      return this.phone + this.internet;
    },
    
    addPayment(pmt) {
      this.payments.push(pmt); //this method will add one payment to 'payments' properties
    },
    
    addPayments(pmts) {
      pmts.forEach(this.addPayment, this); //this method will call 'addPayment' for each element in an array passed (pmts). 
    },
    
    paymentTotal() { //this method will get a total of 'payments' array properties
      return this.payments.reduce((sum, payment)  => sum + payment.total(), 0);
    },
    
    amountDue() { // this method will get a net of total invoices - payments
      return this.total() - this.paymentTotal();
    }
  };
  
  return Object.assign(invObj, services); 
  // **Object.assign method is used in order to create an object (factory function). 
  //Object.assign will return an object that combines the deafult properties above (phoneL 3000, internet: 5500) and the object that is passed as argument to 'services' in this function.
  //In Object.assign, the tartget object is overwritten if there is the same name in the source object. Therfore, if an object passed has any properties assigned, it will overwrite the value of default properties. 
}


function invoiceTotal(invoices) {
  let total = 0;

  for (let index = 0; index < invoices.length; index += 1) {
    total += invoices[index].total();
  }

  return total;
}

let invoices = [];
invoices.push(createInvoice());
invoices.push(createInvoice({ internet: 6500 }));
invoices.push(createInvoice({ phone: 2000 }));
invoices.push(createInvoice({
  phone: 1000,
  internet: 4500,
}));

console.log(invoiceTotal(invoices)); // 31000

////////////////////////////////////////

//2 i used Object.assign method
function createPayment(phonePmt, internetPmt, amountPmt) {
  let pmtObj = {
    phone: 0,
    internet: 0,
    amount: 0,
    
    total () {
      return this.phone + this.internet + this.amount;
    }
  };
  return Object.assign(pmtObj, phonePmt, internetPmt, amountPmt);
}

function paymentTotal(payments) {
  return payments.reduce((sum, payment)  => sum + payment.total(), 0);
}

let payments = [];
payments.push(createPayment());
payments.push(createPayment({
  internet: 6500,
}));

payments.push(createPayment({
  phone: 2000,
}));

payments.push(createPayment({
  phone: 1000,
  internet: 4500,
}));

payments.push(createPayment({
  amount: 10000,
}));

console.log(paymentTotal(payments));      // => 24000

//////////////////////////////////////////////////////

//3 - see the answer at the top
let invoice = createInvoice({
  phone: 1200,
  internet: 4000,
});

let payment1 = createPayment({ amount: 2000 });
let payment2 = createPayment({
  phone: 1000,
  internet: 1200
});

let payment3 = createPayment({ phone: 1000 });

invoice.addPayment(payment1);
invoice.addPayments([payment2, payment3]);
console.log(invoice.amountDue());       // this should return 0







