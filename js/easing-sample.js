(function () {

    'use strict';

    // レンダラを生成
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    document.body.appendChild(renderer.domElement);

    //////////////////////////////////////////////////

    // シーンを生成
    var scene = new THREE.Scene();

    // カメラを生成
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.x = 0;
    camera.position.y = 1.0;
    camera.position.z = 8.0;

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    // ライトの生成
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(10, 10, 10);
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.castShadow = true;
    scene.add(light);

    var ambient = new THREE.AmbientLight(0x666666);
    scene.add(ambient);

    var sphere = new THREE.Object3D();
    var loader = new THREE.TextureLoader();
    loader.load('img/mapping-check.png', function (texture) {
        var geo = new THREE.SphereGeometry(1, 32, 32);
        var mat = new THREE.MeshLambertMaterial({
            map: texture
        });
        sphere = new THREE.Mesh(geo, mat);
        sphere.castShadow = true;
        scene.add(sphere);
    });

    var geo = new THREE.PlaneGeometry(15, 15);
    var mat = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    var plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);


    //////////////////////////////////////////////////

    var dom = document.createElement('div');
    dom.style.cssText = [
        'position: absolute;',
        'top: 0;',
        'left: 0;',
        'color: white;'
    ].join('');
    document.body.appendChild(dom);

    var speed = 0.01;
    var t = 0;
    var start = 0;
    var end = 3;

    function easing(t, a, b) {
        var f = (1.0 - Math.cos(t * Math.PI)) * 0.5;
        var r = a * (1 - f) + b * f;
        return r;
    }

    // アニメーションループ
    (function animate() {
        t += speed;

        if (t >= 1) {
            t = 1;
        }

        var x = easing(t, start, end);
        sphere.position.x = x;

        dom.innerHTML = [
            'X: ', x, '<br />',
            'Position: ', x.toFixed(5)
        ].join('');

        renderer.render(scene, camera);

        // アニメーションループ
        requestAnimationFrame(animate);
    }());

}());
