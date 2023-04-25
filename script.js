let isUpdateStatus = false

//создание объектов игры
function createObjects(num) {
    let arr = [];
    for (let i = 0; i < num; i++) {
        let obj = {
            name: i + 1,
            status: "passive",
            lock: false
        };
        arr.push(obj);
    }
    return arr;
}
let arrObjects = createObjects(15);

//создание копий объектов массива
function doubleObjects(arr) {
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(arr[i], Object.assign({}, arr[i]));
    }
    return newArr;
}

const doubledArr = doubleObjects(arrObjects);

//присваиваем id 
function addIdsToObjects(arr) {
    arr.forEach((obj, index) => {
        obj.id = index + 1;
    });

    return arr;
}

let addIds = addIdsToObjects(doubledArr)

////перемешивание массива объектов
//вспомогательная функция
function putToCache(elem, cache) {
    if (cache.indexOf(elem) != -1) {
        return;
    }
    let i = Math.floor(Math.random() * (cache.length + 1));
    cache.splice(i, 0, elem);
}

//функция возвращающая компаратор
function madness() {
    let cache = [];
    return function (a, b) {
        putToCache(a, cache);
        putToCache(b, cache);
        return cache.indexOf(b) - cache.indexOf(a);
    }
}

//функция перемешивания
function shuffle(arr) {
    let compare = madness();
    return arr.sort(compare);
}
const shake = shuffle(addIds)


//пуш дивов в html
function addDivsToBody(arr) {
    for (let i = 0; i < arr.length; i++) {
        const div = document.createElement('div');
        div.style.width = '60px';
        div.style.height = '60px';
        div.style.backgroundColor = 'lightblue';
        div.style.border = '1px solid black';
        div.style.display = 'inline-block';
        div.style.margin = '5px';
        div.style.textAlign = 'center';
        div.style.lineHeight = '60px';
        div.id = arr[i].id;
        document.body.appendChild(div);
    }
}
addDivsToBody(shake)

//обработчик не совпадений
function updateStatus(arr) {
    isUpdateStatus = true
    const activeArr = arr.filter(obj => obj.status === 'active' && obj.lock === false)

    if (activeArr.length === 2) {
        setTimeout(() => {
            const theSameNames = activeArr[0].name === activeArr[1].name
            if (theSameNames) {
                activeArr.forEach(obj => {
                    obj.lock = true
                })
            } else {
                activeArr.forEach(obj => {
                    const div = document.getElementById(obj.id);
                    div.innerText = '';
                    obj.status = 'passive'
                })
            }
            isUpdateStatus = false
        }, 1000)
    } else {
        isUpdateStatus = false
    }
}

//обработчик действия click
function handleClick(id) {
    if (isUpdateStatus) {
        return
    }
    const div = document.getElementById(id);

    for (let i = 0; i < shake.length; i++) {
        if (shake[i].id == id && shake[i].status === 'passive') {
            div.innerText = shake[i].name;
            shake[i].status = "active";
            continue
        }
    }
    updateStatus(shake)
    console.log(shake)
}

//слушатель 
const divs = document.querySelectorAll('div');
divs.forEach(div => {
    div.addEventListener('click', () => {
        handleClick(div.id)
    });
});