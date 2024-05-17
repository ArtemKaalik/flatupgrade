import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;


// Создание экземпляра загрузчика OBJLoader
// const loader = new OBJLoader();

// Загрузка текстуры
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load('/assets/objects/FlashDerevo.JPG');

// Применение текстуры к загруженному объекту
// loader.load(
//     '/assets/objects/chair/chair.obj',
//     function (object) {
//         object.traverse(function (child) {
//             if (child instanceof THREE.Mesh) {
//                 child.material = new THREE.MeshBasicMaterial({ map: texture });
//             }
//         });

//         object.scale.set(0.25, 0.25, 0.25);
//         scene.add(object);

//         // Добавляем объект к перетаскиваемым объектам
//         draggableObjects.push(object);

//         // Обновляем DragControls с новым объектом
//         dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

//         dragControls.addEventListener('dragstart', function (event) {
//             controls.enabled = false;
//         });

//         dragControls.addEventListener('dragend', function (event) {
//             controls.enabled = true;
//         });
//     }
// );

// Renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor('#2B3846');
document.body.appendChild(renderer.domElement);
// Привязка к html блоку
var container = document.getElementById('canvas-container');
container.appendChild(renderer.domElement);

var scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 1, 1000);
camera.position.z = 90;
scene.add( camera );

// Camera Rotate 
const controls = new OrbitControls( camera, renderer.domElement );

controls.maxDistance = 120;

controls.update();

// Ограничение передвижения камеры по оси Y
const maxCameraY = 70; // Максимальная высота камеры над "землей"
const minCameraY = 10; // Минимальная высота камеры над "землей"

// Ограничение передвижения камеры и объектов по "земле"
function updateCameraPosition() {
    // Ограничение передвижения камеры по оси Y
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, minCameraY, maxCameraY);

    // Обновление вида камеры
    camera.lookAt(scene.position);
}

// Создание "земли"
const groundGeometry = new THREE.PlaneGeometry(100, 100); // Размеры "земли"
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide }); // Материал "земли"
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground); // Добавление "земли" в сцену


// DragControls
const draggableObjects = [];

const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

dragControls.addEventListener('dragstart', function (event) {
    // Остановка вращения камеры во время перетаскивания
    controls.enabled = false;
});

dragControls.addEventListener('dragend', function (event) {
    // Возобновление вращения камеры после завершения перетаскивания
    controls.enabled = true;
});


// For raycaster
document.addEventListener( 'pointermove', onPointerMove );
window.addEventListener( 'resize', onWindowResize );



// Resize Window
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

// Lights
var light = new THREE.PointLight(0xffffff);
light.position.set(-10, 15, 50);
scene.add(light);

// Raycaster для обработки щелчков мыши
var selectedObject = null;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();


function onPointerMove(event) {
    let hoveredObject = null;

    // Проверяем объекты, на которые указывает мышь
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    

    if (intersects.length > 0) {
        const res = intersects.find((res) => res.object !== ground); // Исключаем "ground" из результата

        if (res && res.object) {
            hoveredObject = res.object;

            if (!hoveredObject.originalColor) {
                // Сохраняем исходный цвет объекта при первом выделении
                hoveredObject.originalColor = hoveredObject.material.color.clone();
            }

            // Устанавливаем новый цвет для выделенного объекта
            hoveredObject.material.color.set('gray');
        }
    }

    // Возвращаем исходный цвет предыдущего выделенного объекта, если он был
    if (selectedObject && selectedObject !== hoveredObject) {
        selectedObject.material.color.copy(selectedObject.originalColor);
        selectedObject = null;
    }

    // Обновляем ссылку на текущий выделенный объект
    selectedObject = hoveredObject;
}

document.addEventListener('pointermove', onPointerMove);


var addedObjects = []; // Массив для хранения добавленных объектов

function addBigwall() {
    var bigwallGeometry = new THREE.BoxGeometry(1, 30, 30);
    // добавление текстуры
    var bigwallMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('/assets/objects/brown_wood.jpg'), // Текстура стены
    });

    var bigwall = new THREE.Mesh(bigwallGeometry, bigwallMaterial);
    bigwall.position.set(-20, 0, 0);
    scene.add(bigwall);
    draggableObjects.push(bigwall); // Добавляем для перетаскивания
    controls.update();

    // Добавляем объект в массив добавленных объектов
    addedObjects.push(bigwall);
}

function addSmallwall() {
    var smallwallGeometry = new THREE.BoxGeometry(1, 10, 10);
    // добавление текстуры
    var smallwallMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('/assets/objects/FlashDerevo.JPG'), // Текстура стены
    });

    var smallwall = new THREE.Mesh(smallwallGeometry, smallwallMaterial);
    smallwall.position.set(-20, 0, 0);
    scene.add(smallwall);
    draggableObjects.push(smallwall); // Добавляем для перетаскивания
    controls.update();

    addedObjects.push(smallwall);
}

function addChair() {
    // Создание экземпляра загрузчика OBJLoader
    const loader = new OBJLoader();

    // Загрузка модели "chair"
    loader.load(
        '/assets/objects/chair/chair.obj',
        function (object) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('/assets/objects/FlashDerevo.JPG');

            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshBasicMaterial({ map: texture });
                }
            });
            
            object.scale.set(0.25, 0.25, 0.25);
            scene.add(object);

            // Добавляем объект к перетаскиваемым объектам
            draggableObjects.push(object);
            controls.update()

            addedObjects.push(object);
        }
    );
}

function addBed() {
    // Создание экземпляра загрузчика OBJLoader
    const loader = new OBJLoader();

    loader.load(
        '/assets/objects/bed/10236_Master_Bed_King_Size_v1_L3b.obj',
        function (object) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('/assets/objects/chair/texture-cloth.jpg');

            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshBasicMaterial({ map: texture });
                }
            });
            
            object.scale.set(0.15, 0.15, 0.15);
            object.rotation.x = -Math.PI / 2;
            scene.add(object);

            // Добавляем объект к перетаскиваемым объектам
            draggableObjects.push(object);
            controls.update()

            addedObjects.push(object);

            // Добавляем обработчик события клика на объект
            object.addEventListener('click', function() {
                // Запускаем вертикальное вращение объекта
                startVerticalRotation(object);
            });
        }
    );
}

function addTable() {
    // Создание экземпляра загрузчика OBJLoader
    const loader = new OBJLoader();

    loader.load(
        '/assets/objects/table/table.obj',
        function (object) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('/assets/objects/wood.jpg');

            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshBasicMaterial({ map: texture });
                }
            });
            
            object.scale.set(13, 13, 13);
            // object.rotation.x = -Math.PI / 2;
            scene.add(object);

            // Добавляем объект к перетаскиваемым объектам
            draggableObjects.push(object);
            controls.update()

            addedObjects.push(object);

            // Добавляем обработчик события клика на объект
            object.addEventListener('click', function() {
                // Запускаем вертикальное вращение объекта
                startVerticalRotation(object);
            });
        }
    );
}

function addWall() {
    const wallGeometry = new THREE.BoxGeometry(1, 10, 10);
    const wallMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('/assets/objects/brown_wood.jpg'), // Текстура стены
    });

    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(-20, 0, 0);
    scene.add(wall);
    draggableObjects.push(wall); 
    controls.update();

    addedObjects.push(wall);

    // GUI для регулировки размеров стены
    const gui = new dat.GUI();
    const wallFolder = gui.addFolder('Размеры стены');
    wallFolder.add(wall.scale, 'x', 1, 10).name('Ширина');
    wallFolder.add(wall.scale, 'y', 1, 4).name('Высота');
    wallFolder.add(wall.scale, 'z', 1, 15).name('Длинна');
    wallFolder.open();
    
}

function deleteObject() {
    // Проверяем, есть ли добавленные объекты для удаления
    if (addedObjects.length > 0) {
        const lastAddedObject = addedObjects.pop(); // Получаем последний добавленный объект

        // Удаляем объект из сцены
        scene.remove(lastAddedObject);

        // Удаляем объект из массива перетаскиваемых объектов
        draggableObjects = draggableObjects.filter(obj => obj !== lastAddedObject);

        controls.update();
    }
}

function initGUI() {
    const gui = new dat.GUI();
    gui.add({ addWall: addWall }, 'addWall').name('Добавить стену');
    // gui.add({ addBigwall: addBigwall }, 'addBigwall').name('Большая стена');
    // gui.add({ addSmallwall: addSmallwall }, 'addSmallwall').name('Маленькая стена');
    gui.add({ addChair: addChair }, 'addChair').name('Добавить стул');
    gui.add({ addBed: addBed }, 'addBed').name('Добавить кровать');
    gui.add({ addTable: addTable }, 'addTable').name('Добавить стол');
    gui.add({ deleteObject: deleteObject }, 'deleteObject').name('Отменить последнее действие');
    gui.add({ takeScreenshot: takeScreenshot }, 'takeScreenshot').name('Сохранить скриншот');

}
initGUI();

// Функция для генерации скриншота сцены
function takeScreenshot() {

    var autoClear = renderer.autoClear;
    renderer.autoClear = false;

    // очистка рендерера и зановый рендер
    renderer.clear();
    renderer.render(scene, camera);

    // канвас с размерами сцены
    var canvas = renderer.domElement;
    var width = canvas.width;
    var height = canvas.height;

    // новый канвас для скриншота
    var screenshotCanvas = document.createElement('canvas');
    screenshotCanvas.width = width;
    screenshotCanvas.height = height;

    // контекст рендеринга для нового канваса
    var context = screenshotCanvas.getContext('2d');

    // состояние WebGLRenderer на канвасе (скрин не успевал отрисовыватся)
    context.drawImage(canvas, 0, 0, width, height);

    // значение автообновления рендерера
    renderer.autoClear = autoClear;

    // данные изображения в формате PNG
    var imageData = screenshotCanvas.toDataURL('image/png');

    // ссылку для скачивания изображения
    var link = document.createElement('a');
    link.href = imageData;
    link.download = 'scene_screenshot.png'; // Имя файла для скачивания
    link.click();
}

// Обработчик события клика мыши
document.addEventListener('click', onClick);

function onClick(event) {
    // Определение позиции мыши в нормализованных координатах (от -1 до 1)
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Создаем Raycaster и направляем его от позиции камеры через позицию мыши
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Находим объекты, с которыми пересекается луч
    const intersects = raycaster.intersectObjects(draggableObjects);

    // Если луч пересек какой-то объект
    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;

        // Проверяем, что объект из массива перетаскиваемых объектов
        if (draggableObjects.includes(selectedObject)) {
            // Запускаем вертикальное вращение объекта
            startVerticalRotation(selectedObject);
        }
    }
}

// Функция для начала вертикального вращения объекта
function startVerticalRotation(object) {
    let initialRotationY = object.rotation.y;

    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(event) {
        const mouseX = event.clientX;
        const windowCenterX = window.innerWidth / 2;
        const rotationSpeed = 0.01;
        object.rotation.y = initialRotationY + (mouseX - windowCenterX) * rotationSpeed;
    }

    function onMouseUp() {
        // Удаляем обработчики событий после отпускания кнопки мыши
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}


function checkCollisions() {
    const groundLevel = 0; // Уровень "земли"

    draggableObjects.forEach(object => {
        // Создаем границы объекта
        const objectBox = new THREE.Box3().setFromObject(object);

        // Проверяем, находится ли объект ниже уровня "земли"
        if (objectBox.min.y < groundLevel) {
            // Поднимаем объект над "землей" до нужного уровня
            const offsetY = groundLevel - objectBox.min.y;
            object.position.y += offsetY;
        }
    });
}



function render() {
    requestAnimationFrame(render);

    // Update camera position
    updateCameraPosition();

    // Обновляем позицию камеры так, чтобы она смотрела на центр сцены
    camera.lookAt(scene.position);

    checkCollisions();

    renderer.render(scene, camera);
    controls.update();
}

render();
