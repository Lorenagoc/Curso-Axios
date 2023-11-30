const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

// Set config defaults when creating the instance
const newAxios = axios.create({
    baseURL: 'https://api.example.com'
  });

// Alter defaults after instance has been created
newAxios.defaults.headers.common['Authorization'] = 'newAxios';

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com'
axios.defaults.headers.common['Content-Type'] = 'application/json'

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log(config)
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log('Sucesso')
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error.response)
    return Promise.reject(error);
  });

const get = () => {
    const config = {
        params: {
            _limit: 5
        }
    }
    axios.get('posts', config)
        .then((response) => renderOutput(response))
}

const post = () => {
    const data = {
        title: 'foo',
        body: 'bar',
        userId: 1,
    }
    axios.post('https://jsonplaceholder.typicode.com/posts', data)
        .then((response) => renderOutput(response))
}

const put = () => {
    const data = {
        id: 1,
        title: 'foo',
        body: 'bar',
        userId: 1,
    }
    axios.put('https://jsonplaceholder.typicode.com/posts/1', data)
        .then((response) => renderOutput(response))
}

const patch = () => {
    const data = {
        title: 'foo',
    }
    axios.patch('https://jsonplaceholder.typicode.com/posts/1', data)
        .then((response) => renderOutput(response))
}

const del = () => {
    axios.delete('https://jsonplaceholder.typicode.com/posts/2', data)
        .then((response) => renderOutput(response))
}

const multiple = () => {
    Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5'),
        axios.get('https://jsonplaceholder.typicode.com/users?_limit=5')
    ]).then((response) => {
        console.table(response[0].data)
        console.table(response[1].data)
    })
}

const transform = () => {
    const config = {
        params: {
            _limit: 5
        },
        transformResponse: [function (data) {
            // Faça o que quiser para transformar os dados
            //return data;
            const payload = JSON.parse(data).map(t => {
                return {
                    ...t,
                    is_selected: false,
                }
            })

            return payload
        }],
    }
    axios.get('https://jsonplaceholder.typicode.com/posts', config)
        .then((response) => renderOutput(response))
}

const errorHandling = () => {
    axios.get('https://jsonplaceholder.typicode.com/postsz')
        .then((response) => renderOutput(response))
        .catch((error) => {
            renderOutput(response)
            console.error(error.response.data)
            console.error(error.response.status)
            console.error(error.response.headers)
        })
}

const cancel = () => {
    const controller = new AbortController();
    const config = {
        params: {
            _limit: 5
        },
        signal: controller.signal
    }
    axios.get('https://jsonplaceholder.typicode.com/posts', config)
        .then((response) => renderOutput(response))
        .catch(e.message)

    controller.abort()
}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
