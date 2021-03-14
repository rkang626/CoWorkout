// fake data
const fakeData = {
  'GET': {
    '/api/user/testuser': {
      id: 1,
      first_name: 'Chuck',
      last_name: 'Norris',
      avatar: 'img link',
      gender: 'Male',
      // add more as needed
    },
    '/api/sessions': {
      id: 1,
      // add more as needed
    }
  },

  'POST': {
    '/api/': {
      test: true
    }
  },

  'DELETE': {
    '/api/': {
      test: true
    }
  }
}

// fake delayed promise
const fakePromise = function(fakeData) {
  const fakePromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fakeData);
    }, 2000);
  });
  return fakePromise;
}

// fake axios
const axios = {
  get: function(route) {
    return fakePromise(fakeData['GET'][route]); 
  },
  post: function(route) {
    return fakePromise(fakeData['POST'][route]); 
  },
  delete: function(route) {
    return fakePromise(fakeData['DELETE'][route]); 
  }
}

export default axios;