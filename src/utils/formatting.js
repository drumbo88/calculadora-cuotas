import numeral from 'numeral'

numeral.register('locale', 'ar', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal : function (number) {
        switch (number) {
            case 1: return 'er'
            case 2: return 'do'
            case 3: return 'ro'
            default: return 'to'
        }
    },
    currency: {
        symbol: '$'
    }
})
numeral.locale('ar');

export const getNumber = (v) => numeral(v).format('0.00')

export const getDateTime = (v) => new Date(v).toLocaleString()