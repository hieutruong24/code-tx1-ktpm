// setupTests.js

// Mocking các ??i t??ng và ph??ng th?c c?n thi?t
global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, value) { this.store[key] = value.toString(); },
    removeItem(key) { delete this.store[key]; },
    clear() { this.store = {}; }
};

// C?u hình DOM gi?
document.body.innerHTML = `
  <div class="sanpham"><div class="table-content"></div></div>
  <div class="donhang"><div class="table-content"></div></div>
  <div class="khachhang"><div class="table-content"></div></div>
  <canvas id="myChart1"></canvas>
  <canvas id="myChart2"></canvas>
`;
