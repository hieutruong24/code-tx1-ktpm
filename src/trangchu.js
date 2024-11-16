window.onload = function () {
	khoiTao();

	// Th�m h�nh v�o banner
	addBanner("img/banners/banner0.gif", "img/banners/banner0.gif");
	var numBanner = 9; // S? l??ng h�nh banner
	for (var i = 1; i <= numBanner; i++) {
		var linkimg = "img/banners/banner" + i + ".png";
		addBanner(linkimg, linkimg);
	}

	// Kh?i ??ng th? vi?n h? tr? banner - ch? ch?y khi ?� t?o h�nh trong banner
	var owl = $('.owl-carousel');
	owl.owlCarousel({
		items: 1.5,
		margin: 100,
		center: true,
		loop: true,
		smartSpeed: 450,
		autoplay: true,
		autoplayTimeout: 3500
	});
	// H�m copyObject: d�ng ?? sao ch�p ??i t??ng ho?c m?ng
	function copyObject(obj) {
		return JSON.parse(JSON.stringify(obj)); // Ho?c d�ng {...obj} n?u c?n sao ch�p n�ng
	}


	// autocomplete cho khung tim kiem
	autocomplete(document.getElementById('search-box'), list_products);

	// th�m tags (t? kh�a) v�o khung t�m ki?m
	var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
	for (var t of tags) addTags(t, "index.html?search=" + t);

	// Th�m danh s�ch h�ng ?i?n tho?i
	var company = ["Apple.jpg", "Samsung.jpg", "Oppo.jpg", "Nokia.jpg", "Huawei.jpg", "Xiaomi.png",
		"Realme.png", "Vivo.jpg", "Philips.jpg", "Mobell.jpg", "Mobiistar.jpg", "Itel.jpg",
		"Coolpad.png", "HTC.jpg", "Motorola.jpg"
	];
	for (var c of company) addCompany("img/company/" + c, c.slice(0, c.length - 4));

	// Th�m s?n ph?m v�o trang
	var sanPhamPhanTich
	var sanPhamPhanTrang;

	var filters = getFilterFromURL();
	if (filters.length) { // c� filter
		sanPhamPhanTich = phanTich_URL(filters, true);
		sanPhamPhanTrang = tinhToanPhanTrang(sanPhamPhanTich, filtersFromUrl.page || 1);
		if (!sanPhamPhanTrang.length) alertNotHaveProduct(false);
		else addProductsFrom(sanPhamPhanTrang);

		// hi?n th? list s?n ph?m
		document.getElementsByClassName('contain-products')[0].style.display = '';

	} else { // ko c� filter : trang ch�nh m?c ??nh s? hi?n th? c�c sp hot, ...
		var soLuong = (window.innerWidth < 1200 ? 4 : 5); // m�n h�nh nh? th� hi?n th? 4 sp, to th� hi?n th? 5

		// C�c m�u
		var yellow_red = ['#ff9c00', '#ec1f1f'];
		var blue = ['#42bcf4', '#004c70'];
		var green = ['#5de272', '#007012'];

		// Th�m c�c khung s?n ph?m
		var div = document.getElementsByClassName('contain-khungSanPham')[0];
		addKhungSanPham('N?I B?T NH?T', yellow_red, ['star=3', 'sort=rateCount-decrease'], soLuong, div);
		addKhungSanPham('S?N PH?M M?I', blue, ['promo=moiramat', 'sort=rateCount-decrease'], soLuong, div);
		addKhungSanPham('TR? G�P 0%', yellow_red, ['promo=tragop', 'sort=rateCount-decrease'], soLuong, div);
		addKhungSanPham('GI� S?C ONLINE', green, ['promo=giareonline', 'sort=rateCount-decrease'], soLuong, div);
		addKhungSanPham('GI?M GI� L?N', yellow_red, ['promo=giamgia'], soLuong, div);
		addKhungSanPham('GI� R? CHO M?I NH�', green, ['price=0-3000000', 'sort=price'], soLuong, div);
	}

	// Th�m ch?n m?c gi�
	addPricesRange(0, 2000000);
	addPricesRange(2000000, 4000000);
	addPricesRange(4000000, 7000000);
	addPricesRange(7000000, 13000000);
	addPricesRange(13000000, 0);

	// Th�m ch?n khuy?n m�i
	addPromotion('giamgia');
	addPromotion('tragop');
	addPromotion('moiramat');
	addPromotion('giareonline');

	// Th�m ch?n s? sao
	addStarFilter(3);
	addStarFilter(4);
	addStarFilter(5);

	// Th�m ch?n s?p x?p
	addSortFilter('ascending', 'price', 'Gi� t?ng d?n');
	addSortFilter('decrease', 'price', 'Gi� gi?m d?n');
	addSortFilter('ascending', 'star', 'Sao t?ng d?n');
	addSortFilter('decrease', 'star', 'Sao gi?m d?n');
	addSortFilter('ascending', 'rateCount', '?�nh gi� t?ng d?n');
	addSortFilter('decrease', 'rateCount', '?�nh gi� gi?m d?n');
	addSortFilter('ascending', 'name', 'T�n A-Z');
	addSortFilter('decrease', 'name', 'T�n Z-A');

	// Th�m filter ?� ch?n
	addAllChoosedFilter();
};

var soLuongSanPhamMaxTrongMotTrang = 15;

// =========== ??c d? li?u t? url ============
var filtersFromUrl = { // C�c b? l?c t�m ???c tr�n url s? ?c l?u v�o ?�y
	company: '',
	search: '',
	price: '',
	promo: '',
	star: '',
	page: '',
	sort: {
		by: '',
		type: 'ascending'
	}
}

function getFilterFromURL() { // t�ch v� tr? v? m?ng b? l?c tr�n url
	var fullLocation = window.location.href;
	fullLocation = decodeURIComponent(fullLocation);
	var dauHoi = fullLocation.split('?'); // t�ch theo d?u ?

	if (dauHoi[1]) {
		var dauVa = dauHoi[1].split('&');
		return dauVa;
	}

	return [];
}

function phanTich_URL(filters, saveFilter) {
	// var filters = getFilterFromURL();
	var result = copyObject(list_products);

	for (var i = 0; i < filters.length; i++) {
		var dauBang = filters[i].split('=');

		switch (dauBang[0]) {
			case 'search':
				dauBang[1] = dauBang[1].split('+').join(' ');
				result = timKiemTheoTen(result, dauBang[1]);
				if (saveFilter) filtersFromUrl.search = dauBang[1];
				break;

			case 'price':
				if (saveFilter) filtersFromUrl.price = dauBang[1];

				var prices = dauBang[1].split('-');
				prices[1] = Number(prices[1]) || 1E10;
				result = timKiemTheoGiaTien(result, prices[0], prices[1]);
				break;

			case 'company':
				result = timKiemTheoCongTySanXuat(result, dauBang[1]);
				if (saveFilter) filtersFromUrl.company = dauBang[1];
				break;

			case 'star':
				result = timKiemTheoSoLuongSao(result, dauBang[1]);
				if (saveFilter) filtersFromUrl.star = dauBang[1];
				break;

			case 'promo':
				result = timKiemTheoKhuyenMai(result, dauBang[1]);
				if (saveFilter) filtersFromUrl.promo = dauBang[1];
				break;

			case 'page': // page lu�n ? cu?i ???ng link
				if (saveFilter) filtersFromUrl.page = dauBang[1];
				break;

			case 'sort':
				var s = dauBang[1].split('-');
				var tenThanhPhanCanSort = s[0];

				switch (tenThanhPhanCanSort) {
					case 'price':
						if (saveFilter) filtersFromUrl.sort.by = 'price';
						result.sort(function (a, b) {
							var giaA = parseInt(a.price.split('.').join(''));
							var giaB = parseInt(b.price.split('.').join(''));
							return giaA - giaB;
						});
						break;

					case 'star':
						if (saveFilter) filtersFromUrl.sort.by = 'star';
						result.sort(function (a, b) {
							return a.star - b.star;
						});
						break;

					case 'rateCount':
						if (saveFilter) filtersFromUrl.sort.by = 'rateCount';
						result.sort(function (a, b) {
							return a.rateCount - b.rateCount;
						});
						break;

					case 'name':
						if (saveFilter) filtersFromUrl.sort.by = 'name';
						result.sort(function (a, b) {
							return a.name.localeCompare(b.name);
						});
						break;
				}

				if (s[1] == 'decrease') {
					if (saveFilter) filtersFromUrl.sort.type = 'decrease';
					result.reverse();
				}

				break;
		}
	}

	return result;
}

// th�m c�c s?n ph?m t? bi?n m?ng n�o ?� v�o trang
function addProductsFrom(list, vitri, soluong) {
	var start = vitri || 0;
	var end = (soluong ? start + soluong : list.length);
	for (var i = start; i < end; i++) {
		addProduct(list[i]);
	}
}

function clearAllProducts() {
	document.getElementById('products').innerHTML = "";
}

// Th�m s?n ph?m v�o c�c khung s?n ph?m
function addKhungSanPham(tenKhung, color, filter, len, ele) {
	// convert color to code
	var gradient = `background-image: linear-gradient(120deg, ` + color[0] + ` 0%, ` + color[1] + ` 50%, ` + color[0] + ` 100%);`
	var borderColor = `border-color: ` + color[0];
	var borderA = `	border-left: 2px solid ` + color[0] + `;
					border-right: 2px solid ` + color[0] + `;`;

	// m? tag
	var s = `<div class="khungSanPham" style="` + borderColor + `">
				<h3 class="tenKhung" style="` + gradient + `">* ` + tenKhung + ` *</h3>
				<div class="listSpTrongKhung flexContain">`;

	// th�m c�c <li> (s?n ph?m) v�o tag
	var spResult = phanTich_URL(filter, false);
	if (spResult.length < len) len = spResult.length;

	for (var i = 0; i < len; i++) {
		s += addProduct(spResult[i], null, true);
		// truy?n v�o 'true' ?? tr? v? chu?i r?i g�n v�o s
	}

	// th�m n�t xem t?t c? r?i ?�ng tag
	s += `	</div>
			<a class="xemTatCa" href="index.html?` + filter.join('&') + `" style="` + borderA + `">
				Xem t?t c? ` + spResult.length + ` s?n ph?m
			</a>
		</div> <hr>`;

	// th�m khung v�o contain-khung
	ele.innerHTML += s;
}

// N�t ph�n trang
function themNutPhanTrang(soTrang, trangHienTai) {
	var divPhanTrang = document.getElementsByClassName('pagination')[0];

	var k = createLinkFilter('remove', 'page'); // x�a ph�n trang c?
	if (k.indexOf('?') > 0) k += '&';
	else k += '?'; // th�m d?u

	if (trangHienTai > 1) // N�t v? ph�n trang tr??c
		divPhanTrang.innerHTML = `<a href="` + k + `page=` + (trangHienTai - 1) + `"><i class="fa fa-angle-left"></i></a>`;

	if (soTrang > 1) // Ch? hi?n n�t ph�n trang n?u s? trang > 1
		for (var i = 1; i <= soTrang; i++) {
			if (i == trangHienTai) {
				divPhanTrang.innerHTML += `<a href="javascript:;" class="current">` + i + `</a>`

			} else {
				divPhanTrang.innerHTML += `<a href="` + k + `page=` + (i) + `">` + i + `</a>`
			}
		}

	if (trangHienTai < soTrang) { // N�t t?i ph�n trang sau
		divPhanTrang.innerHTML += `<a href="` + k + `page=` + (trangHienTai + 1) + `"><i class="fa fa-angle-right"></i></a>`
	}
}

// T�nh to�n xem c� bao nhi�u trang + trang hi?n t?i,
// Tr? v? m?ng s?n ph?m trong trang hi?n t?i t�nh ???c
function tinhToanPhanTrang(list, vitriTrang) {
	var sanPhamDu = list.length % soLuongSanPhamMaxTrongMotTrang;
	var soTrang = parseInt(list.length / soLuongSanPhamMaxTrongMotTrang) + (sanPhamDu ? 1 : 0);
	var trangHienTai = parseInt(vitriTrang < soTrang ? vitriTrang : soTrang);

	themNutPhanTrang(soTrang, trangHienTai);
	var start = soLuongSanPhamMaxTrongMotTrang * (trangHienTai - 1);

	var temp = JSON.parse(JSON.stringify(list));

	return temp.splice(start, soLuongSanPhamMaxTrongMotTrang);
}

// ======== T�M KI?M (T? m?ng list truy?n v�o, tr? v? 1 m?ng k?t qu?) ============

// function timKiemTheoTen(list, ten, soluong) {}
// h�m T�m-ki?m-theo-t�n ???c ??t trong dungchung.js , do trang chitietsanpham c?ng c?n d�ng t?i n�

function timKiemTheoCongTySanXuat(list, tenCongTy, soluong) {
	var count, result = [];
	if (soluong < list.length) count = soluong;
	else count = list.length;

	for (var i = 0; i < list.length; i++) {
		if (list[i].company.toUpperCase().indexOf(tenCongTy.toUpperCase()) >= 0) {
			result.push(list[i]);
			count--;
			if (count <= 0) break;
		}
	}
	return result;
}

function timKiemTheoSoLuongSao(list, soLuongSaoToiThieu, soluong) {
	var count, result = [];
	if (soluong < list.length) count = soluong;
	else count = list.length;

	for (var i = 0; i < list.length; i++) {
		if (list[i].star >= soLuongSaoToiThieu) {
			result.push(list[i]);
			count--;
			if (count <= 0) break;
		}
	}

	return result;
}

function timKiemTheoGiaTien(list, giaMin, giaMax, soluong) {
	var count, result = [];
	if (soluong < list.length) count = soluong;
	else count = list.length;

	for (var i = 0; i < list.length; i++) {
		var gia = parseInt(list[i].price.split('.').join(''));
		if (gia >= giaMin && gia <= giaMax) {
			result.push(list[i]);
			count--;
			if (count <= 0) break;
		}
	}

	return result;
}

function timKiemTheoKhuyenMai(list, tenKhuyenMai, soluong) {
	var count, result = [];
	if (soluong < list.length) count = soluong;
	else count = list.length;

	for (var i = 0; i < list.length; i++) {
		if (list[i].promo.name == tenKhuyenMai) {
			result.push(list[i]);
			count--;
			if (count <= 0) break;
		}
	}

	return result;
}

function timKiemTheoRAM(list, luongRam, soluong) {
	var count, result = [];
	if (soluong < list.length) count = soluong;
	else count = list.length;

	for (var i = 0; i < list.length; i++) {
		if (parseInt(list[i].detail.ram) == luongRam) {
			result.push(list[i]);
			count--;
			if (count <= 0) break;
		}
	}

	return result;
}

// ========== L?C ===============
// Th�m b? l?c ?� ch?n v�o html
function addChoosedFilter(type, textInside) {
	var link = createLinkFilter('remove', type);
	var tag_a = `<a href="` + link + `"><h3>` + textInside + ` <i class="fa fa-close"></i> </h3></a>`;

	var divChoosedFilter = document.getElementsByClassName('choosedFilter')[0];
	divChoosedFilter.innerHTML += tag_a;

	var deleteAll = document.getElementById('deleteAllFilter');
	deleteAll.style.display = "block";
	deleteAll.href = window.location.href.split('?')[0];
}

// Th�m nhi?u b? l?c c�ng l�c 
function addAllChoosedFilter() {
	// Th�m t? bi?n l?u gi? b? l?c 'filtersFromUrl'

	if (filtersFromUrl.company != '')
		addChoosedFilter('company', filtersFromUrl.company);

	if (filtersFromUrl.search != '')
		addChoosedFilter('search', '"' + filtersFromUrl.search + '"');

	if (filtersFromUrl.price != '') {
		var prices = filtersFromUrl.price.split('-');
		addChoosedFilter('price', priceToString(prices[0], prices[1]));
	}

	if (filtersFromUrl.promo != '')
		addChoosedFilter('promo', promoToString(filtersFromUrl.promo));

	if (filtersFromUrl.star != '')
		addChoosedFilter('star', starToString(filtersFromUrl.star));

	if (filtersFromUrl.sort.by != '') {
		var sortBy = sortToString(filtersFromUrl.sort.by);
		var kieuSapXep = (filtersFromUrl.sort.type == 'decrease' ? 'gi?m d?n' : 't?ng d?n');
		addChoosedFilter('sort', sortBy + kieuSapXep);
	}
}

// T?o link cho b? l?c
// type l� 'add' ho?c 'remove',
// t??ng ?ng 'th�m' b? l?c m?i c� gi� tr? = valueAdd, ho?c 'x�a' b? l?c ?� c�
function createLinkFilter(type, nameFilter, valueAdd) {
	var o = JSON.parse(JSON.stringify(filtersFromUrl));
	o.page = ''; // reset ph�n trang

	if (nameFilter == 'sort') {
		if (type == 'add') {
			o.sort.by = valueAdd.by;
			o.sort.type = valueAdd.type;

		} else if (type == 'remove') {
			o.sort.by = '';
		}

	} else {
		if (type == 'add') o[nameFilter] = valueAdd;
		else if (type == 'remove') o[nameFilter] = '';
	}

	var link = 'index.html'; //window.location.href.split('?')[0].replace('#', '');
	var h = false; // ?� c� d?u h?i hay ch?a

	// th�m nh?ng filter tr??c sort
	for (var i in o) {
		if (i != 'sort' && o[i]) {
			link += (h ? '&' : '?') + i + '=' + o[i];
			h = true;
		}
	}

	// th�m sort (do sort trong filtersFromUrl l� ki?u object, kh�c v?i ki?u string c?a nh?ng lo?i c�n l?i)
	// n�n l�c t?o link s? kh�c nh?ng lo?i tr�n
	if (o.sort.by != '')
		link += (h ? '&' : '?') + 'sort=' + o.sort.by + '-' + o.sort.type;

	return link;
}

// Th�ng b�o n?u kh�ng c� s?n ph?m
function alertNotHaveProduct(coSanPham) {
	var thongbao = document.getElementById('khongCoSanPham');
	if (!coSanPham) {
		thongbao.style.width = "auto";
		thongbao.style.opacity = "1";
		thongbao.style.margin = "auto"; // C?n gi?a
		thongbao.style.transitionDuration = "1s"; // hi?n ra t? t?

	} else {
		thongbao.style.width = "0";
		thongbao.style.opacity = "0";
		thongbao.style.margin = "0";
		thongbao.style.transitionDuration = "0s"; // Ngay l�p t?c bi?n m?t
	}
}

// ========== L?c TRONG TRANG ============
// Hi?n th? S?n ph?m
function showLi(li) {
	li.style.opacity = 1;
	li.style.width = "239px";
	li.style.borderWidth = "1px";
}
// ?n s?n ph?m
function hideLi(li) {
	li.style.width = 0;
	li.style.opacity = 0;
	li.style.borderWidth = "0";
}

// L?y m?ng s?n ph?m trong trang hi?n t?i (? d?ng tag html)
function getLiArray() {
	var ul = document.getElementById('products');
	var listLi = ul.getElementsByTagName('li');
	return listLi;
}

// l?c theo t�n
function getNameFromLi(li) {
	var a = li.getElementsByTagName('a')[0];
	var h3 = a.getElementsByTagName('h3')[0];
	var name = h3.innerHTML;
	return name;
}

function filterProductsName(ele) {
	var filter = ele.value.toUpperCase();
	var listLi = getLiArray();
	var coSanPham = false;

	var soLuong = 0;

	for (var i = 0; i < listLi.length; i++) {
		if (getNameFromLi(listLi[i]).toUpperCase().indexOf(filter) > -1 &&
			soLuong < soLuongSanPhamMaxTrongMotTrang) {
			showLi(listLi[i]);
			coSanPham = true;
			soLuong++;

		} else {
			hideLi(listLi[i]);
		}
	}

	// Th�ng b�o n?u kh�ng c� s?n ph?m
	alertNotHaveProduct(coSanPham);
}

// l?c theo s? l??ng sao
function getStarFromLi(li) {
	var a = li.getElementsByTagName('a')[0];
	var divRate = a.getElementsByClassName('ratingresult');
	if (!divRate) return 0;

	divRate = divRate[0];
	var starCount = divRate.getElementsByClassName('fa-star').length;

	return starCount;
}

function filterProductsStar(num) {
	var listLi = getLiArray();
	var coSanPham = false;

	for (var i = 0; i < listLi.length; i++) {
		if (getStarFromLi(listLi) >= num) {
			showLi(listLi[i]);
			coSanPham = true;

		} else {
			hideLi(listLi[i]);
		}
	}

	// Th�ng b�o n?u kh�ng c� s?n ph?m
	alertNotHaveProduct(coSanPham);
}

// ================= H�m kh�c ==================

// Th�m banner
function addBanner(img, link) {
	var newDiv = `<div class='item'>
						<a target='_blank' href=` + link + `>
							<img src=` + img + `>
						</a>
					</div>`;
	var banner = document.getElementsByClassName('owl-carousel')[0];
	banner.innerHTML += newDiv;
}

// Th�m h�ng s?n xu?t
function addCompany(img, nameCompany) {
	var link = createLinkFilter('add', 'company', nameCompany);
	var new_tag = `<a href=` + link + `><img src=` + img + `></a>`;

	var khung_hangSanXuat = document.getElementsByClassName('companyMenu')[0];
	khung_hangSanXuat.innerHTML += new_tag;
}

// Th�m ch?n m?c gi�
function addPricesRange(min, max) {
	var text = priceToString(min, max);
	var link = createLinkFilter('add', 'price', min + '-' + max);

	var mucgia = `<a href="` + link + `">` + text + `</a>`;
	document.getElementsByClassName('pricesRangeFilter')[0]
		.getElementsByClassName('dropdown-content')[0].innerHTML += mucgia;
}

// Th�m ch?n khuy?n m�i
function addPromotion(name) {
	var link = createLinkFilter('add', 'promo', name);

	var text = promoToString(name);
	var promo = `<a href="` + link + `">` + text + `</a>`;
	document.getElementsByClassName('promosFilter')[0]
		.getElementsByClassName('dropdown-content')[0].innerHTML += promo;
}

// Th�m ch?n s? l??ng sao
function addStarFilter(value) {
	var link = createLinkFilter('add', 'star', value);

	var text = starToString(value);
	var star = `<a href="` + link + `">` + text + `</a>`;
	document.getElementsByClassName('starFilter')[0]
		.getElementsByClassName('dropdown-content')[0].innerHTML += star;
}

// Th�m ch?n s?p x?p theo gi�
function addSortFilter(type, nameFilter, text) {
	var link = createLinkFilter('add', 'sort', {
		by: nameFilter,
		type: type
	});
	var sortTag = `<a href="` + link + `">` + text + `</a>`;

	document.getElementsByClassName('sortFilter')[0]
		.getElementsByClassName('dropdown-content')[0].innerHTML += sortTag;
}

// Chuy?n m?c gi� v? d?ng chu?i ti?ng vi?t
function priceToString(min, max) {
	if (min == 0) return 'D??i ' + max / 1E6 + ' tri?u';
	if (max == 0) return 'Tr�n ' + min / 1E6 + ' tri?u';
	return 'T? ' + min / 1E6 + ' - ' + max / 1E6 + ' tri?u';
}

// Chuy?n khuy?n m�i v? d?ng chu?i ti?ng vi?t
function promoToString(name) {
	switch (name) {
		case 'tragop':
			return 'Tr? g�p';
		case 'giamgia':
			return 'Gi?m gi�';
		case 'giareonline':
			return 'Gi� r? online';
		case 'moiramat':
			return 'M?i ra m?t';
	}
}

// Chuy?n s? sao v? d?ng chu?i ti?ng vi?t
function starToString(star) {
	return 'Tr�n ' + (star - 1) + ' sao';
}

// Chuy?n c�c lo?i s?p x?p v? d?ng chu?i ti?ng vi?t
function sortToString(sortBy) {
	switch (sortBy) {
		case 'price':
			return 'Gi� ';
		case 'star':
			return 'Sao ';
		case 'rateCount':
			return '?�nh gi� ';
		case 'name':
			return 'T�n ';
		default:
			return '';
	}
}

// H�m Test, ch?a s? d?ng
function hideSanPhamKhongThuoc(list) {
	var allLi = getLiArray();
	for (var i = 0; i < allLi.length; i++) {
		var hide = true;
		for (var j = 0; j < list.length; j++) {
			if (getNameFromLi(allLi[i]) == list[j].name) {
				hide = false;
				break;
			}
		}
		if (hide) hideLi(allLi[i]);
	}
}
module.exports = {
	getFilterFromURL,
	phanTich_URL,
	tinhToanPhanTrang,
	timKiemTheoGiaTien
};