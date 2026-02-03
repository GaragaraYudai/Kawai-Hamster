import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

// --- 1. Three.js 기본 셋팅 ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505); // 배경색

// 카메라 설정
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 1, 5); // 약간 위에서 바라보도록

// 렌더러 설정 (모바일 최적화 포함)
const renderer = new THREE.WebGLRenderer({
    antialias: false, // 모바일 성능
    alpha: true,
    powerPreference: "high-performance"
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 픽셀 비율 제한
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// 컨트롤 (마우스로 돌려보기 가능)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.target.set(0, 0.5, 0); // 모델 중심을 바라보도록

// --- 2. 조명 설정 ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(5, 10, 5);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 1;
scene.add(spotLight);

const pointLight1 = new THREE.PointLight(0x4444ff, 1.5);
pointLight1.position.set(-5, 2, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff4444, 1.5);
pointLight2.position.set(5, -2, 5);
scene.add(pointLight2);

// --- 3. GLB 햄스터 모델 로드 ---
let model;
let mixer; // 애니메이션 믹서
const clock = new THREE.Clock();

const loader = new GLTFLoader();
loader.load(
    './hamster.glb',
    (gltf) => {
        model = gltf.scene;

        // 모델 크기 및 위치 조정
        model.scale.set(1.5, 1.5, 1.5);
        model.position.set(0, -0.5, 0);

        scene.add(model);

        // 애니메이션이 있으면 재생
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        }
    },
    (progress) => {
        console.log('Loading:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('모델 로드 에러:', error);
    }
);


// --- 4. 애니메이션 루프 ---
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // 애니메이션 믹서 업데이트
    if (mixer) {
        mixer.update(delta);
    }

    // 모델 천천히 회전
    if (model) {
        model.rotation.y += 0.005;
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();

// 화면 크기 변경 대응
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});


// --- 5. 왼쪽 메뉴 텍스트 랜덤 RGB 효과 ---
const menuItems = document.querySelectorAll('.menu-item');

function triggerRandomGlitch() {
    menuItems.forEach(item => {
        item.classList.remove('glitch-active');
        item.style.background = 'transparent';
    });

    const randomIndex = Math.floor(Math.random() * menuItems.length);
    const targetItem = menuItems[randomIndex];

    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;

    targetItem.classList.add('glitch-active');
    targetItem.style.background = `linear-gradient(90deg, rgba(${r},${g},${b}, 0.6) 0%, rgba(${r},${g},${b}, 0) 70%)`;

    const nextTime = Math.random() * 600 + 200;
    setTimeout(triggerRandomGlitch, nextTime);
}

triggerRandomGlitch();
