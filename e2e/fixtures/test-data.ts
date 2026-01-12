/**
 * Datos de Prueba para Tests E2E
 * ISO/IEC 29119 - Test Data Specification
 *
 * Contiene usuarios de prueba, acciones y tarjetas VISA para validación
 */

export const testUsers = {
  // Usuario de prueba 1 (debe existir en la base de datos de prueba)
  user1: {
    username: 'testuser1',
    email: 'test1@stocksim.com',
    password: 'test123abc',
    firstName: 'Test',
    lastName: 'User1'
  },

  // Usuario de prueba 2
  user2: {
    username: 'testuser2',
    email: 'test2@stocksim.com',
    password: 'test123abc',
    firstName: 'Test',
    lastName: 'User2'
  },

  // Usuario para pruebas de carga
  loadTest: {
    username: 'loadtest',
    email: 'load@stocksim.com',
    password: 'test123abc',
    firstName: 'Load',
    lastName: 'Tester'
  }
};

export const testStocks = {
  // Acciones disponibles en el sistema de prueba
  aapl: {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    description: 'Technology company'
  },

  googl: {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    description: 'Search and advertising'
  },

  msft: {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    description: 'Software company'
  },

  amzn: {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    description: 'E-commerce and cloud'
  },

  tsla: {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    description: 'Electric vehicles'
  }
};

export const testCards = {
  // Tarjetas VISA válidas (pasan el algoritmo de Luhn)
  validVisa1: '4532015112830366',
  validVisa2: '4916338506082832',
  validVisa3: '4024007198964305',

  // Tarjetas inválidas (para pruebas negativas)
  invalidVisa1: '4532015112830367', // Dígito verificador incorrecto
  invalidVisa2: '3532015112830366', // No comienza con 4
  invalidVisa3: '123456789012345'   // Formato incorrecto
};

export const testPurchases = {
  // Datos de compra de ejemplo
  smallPurchase: {
    quantity: 5,
    amount: 750.00
  },

  mediumPurchase: {
    quantity: 10,
    amount: 1500.00
  },

  largePurchase: {
    quantity: 50,
    amount: 7500.00
  }
};

export const apiEndpoints = {
  // Endpoints del backend (puerto 8080 en Docker)
  baseUrl: 'http://localhost:8080/api',
  stocks: {
    all: '/stock/all',
    byTicker: (ticker: string) => `/stock/${ticker}`,
    ownedByUser: (username: string) => `/stock/ownedstocks/${username}`
  },
  transactions: {
    all: (username: string) => `/transaction/all?user=${username}`,
    buy: '/transaction/buy',
    sell: '/transaction/sell',
    transfer: '/transaction/transfer'
  }
};
