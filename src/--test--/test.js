const { getFilterFromURL, timKiemTheoGiaTien } = require('../trangchu.js');


describe('Test getFilterFromURL function', () => {
    test('Should return filters from URL with query string', () => {
        const mockLocation = 'http://example.com/?search=iphone&price=0-2000000';
        delete window.location;
        window.location = { href: mockLocation };

        const filters = getFilterFromURL();
        expect(filters).toEqual(['search=iphone', 'price=0-2000000']);
    });

    test('Should return empty array if no query string', () => {
        const mockLocation = 'http://example.com/';
        delete window.location;
        window.location = { href: mockLocation };

        const filters = getFilterFromURL();
        expect(filters).toEqual([]);
    });
});

describe('Test timKiemTheoGiaTien function', () => {
    const mockProducts = [
        { name: 'iPhone', price: '2000000' },
        { name: 'Samsung', price: '1500000' },
    ];

    test('Should return products within price range', () => {
        const result = timKiemTheoGiaTien(mockProducts, 1000000, 2000000);
        expect(result).toEqual(mockProducts);
    });

    test('Should return empty array if no product matches', () => {
        const result = timKiemTheoGiaTien(mockProducts, 3000000, 4000000);
        expect(result).toEqual([]);
    });
});


