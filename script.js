import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

// --- 1. Three.js 기본 셋팅 ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505); // 배경색

// 카메라 설정
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 5); // 정면에서 약간 뒤

// 렌더러 설정 (모바일 최적화 포함)
const renderer = new THREE.WebGLRenderer({
    antialias: false, // 모바일 성능
    alpha: true,
    powerPreference: "high-performance"
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 픽셀 비율 제한
renderer.toneMapping = THREE.ACESFilmicToneMapping; // 영화 같은 톤 매핑
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// 컨트롤 (마우스로 돌려보기 가능)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

// --- 2. 조명 설정 (다이아몬드 전시 느낌) ---
// 주변광 (은은하게)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// 스포트라이트 (주인공을 비추는 강한 빛)
const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(5, 10, 5);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 1;
scene.add(spotLight);

// 포인트 라이트 (반짝임을 위해 여러 각도에서 배치)
const pointLight1 = new THREE.PointLight(0x4444ff, 1.5); // 푸른빛
pointLight1.position.set(-5, 2, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff4444, 1.5); // 붉은빛
pointLight2.position.set(5, -2, 5);
scene.add(pointLight2);

// --- 3. 3D 모델 (다이아몬드) ---
let model;

const geometry = new THREE.IcosahedronGeometry(1.2, 0); // 다이아몬드 형태
const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9, // 유리/보석 같은 투명도
    thickness: 1.5,
    clearcoat: 1.0,
});
model = new THREE.Mesh(geometry, material);
scene.add(model);


// --- 4. 애니메이션 루프 ---
function animate() {
    requestAnimationFrame(animate);

    // 모델 회전 (빙글빙글)
    if (model) {
        model.rotation.y += 0.005; // 천천히 회전
        model.rotation.x += 0.002; // 약간의 입체감을 위해 X축도 회전
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


// --- 5. 왼쪽 메뉴 텍스트 랜덤 RGB 효과 (디지털 느낌) ---
const menuItems = document.querySelectorAll('.menu-item');

function triggerRandomGlitch() {
    // 1. 모든 아이템 초기화
    menuItems.forEach(item => {
        item.classList.remove('glitch-active');
        item.style.background = 'transparent';
    });

    // 2. 랜덤한 메뉴 아이템 선택
    const randomIndex = Math.floor(Math.random() * menuItems.length);
    const targetItem = menuItems[randomIndex];

    // 3. 랜덤 RGB 색상 생성 (너무 어둡지 않게 최소값 55 설정)
    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;

    // 4. 스타일 적용
    targetItem.classList.add('glitch-active');

    // 그라데이션: 왼쪽(랜덤색) -> 오른쪽(투명)
    targetItem.style.background = `linear-gradient(90deg, rgba(${r},${g},${b}, 0.6) 0%, rgba(${r},${g},${b}, 0) 70%)`;

    // 5. 다음 실행을 위한 타이머 (속도 조절: 200ms ~ 800ms 사이 랜덤)
    const nextTime = Math.random() * 600 + 200;
    setTimeout(triggerRandomGlitch, nextTime);
}

// 효과 시작
triggerRandomGlitch();
