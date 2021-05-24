let scene, camera, renderer, hlight, plane,ufo,ufo1, star = [], cloud = [],listener,sound;
let max_star = 6, points = 0;
let ufob;

let missile = [];

let health_ufo = 100;
let health_ufo1 = 100;
let health_ufob = 1000;
let health_plane = 250;
let flag = 0;
let score = 0;
let adx = 0.5;
let adx1 = 0.5;
var speed = 50;
var clock = new THREE.Clock();
var delta = 0;
let flag_big = 0;

function starloader(gltf) {

    star = gltf.scene;
    star.rotation.set(1, 3, 0);
    star.position.set(
        400,
        300,
        100
    );
}

function planeloader(gltf) {
    plane = gltf.scene;
    plane.userData = "Plane";
    plane.rotation.set(1.0, 3.15, 0);
    plane.position.set(0, -70, 50);

    scene.add(plane);
}

function ufoloader(gltf) {
    ufo = gltf.scene;
    ufo.rotation.set(0.8, 0, 0);
    ufo.position.set(
        Math.floor(Math.random() * (2 * 90)) - 90,
        30,
        50);
    scene.add(ufo);
}

function ufoloader1(gltf) {
    ufo1 = gltf.scene;
    ufo1.rotation.set(1.0, 0, 0);
    ufo1.position.set(
        Math.floor(Math.random() * (2 * 90)) - 90,
        60,
        50);

    scene.add(ufo1);
}

function staradd(loader) {
    
    for( let i =0;i<max_star; i++)
    {
            star[i] = loader.load('star.gltf', function (gltf) {
            star[i] = gltf.scene;
            star[i].rotation.set(1, 3, 0);
            if(i%3==0)
            {
                star[i].position.set(
                    Math.floor(Math.random() * (2 * 90)) - 90,
                    Math.floor(Math.random() * (2 * 30)) - 30,
                    50
                    );  
            }      
            else
            {
                let ady = 0;
                if(star[i-1].position.x<0)
                {
                    ady = -3;
                }
                else
                {
                    ady = 3;
                }
                star[i].position.set(
                    star[i-1].position.x +10,
                    star[i-1].position.y + ady,
                    50
                );
            }
            scene.add(star[i]);
            }         
        );
    }
}

function cloudadd() {
    const cloudLoader = new THREE.TextureLoader();
    cloudLoader.load("smoke.png", function (texture) {
        cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
        cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        });
        let height = window.innerHeight;
        let width = window.innerWidth;
        for (let i = 0; i < 3; i++) {
                cloud[i] = new THREE.Mesh(cloudGeo, cloudMaterial);
                cloud[i].position.set(
                    Math.floor(Math.random() * (2 * 500)) - 500,
                    Math.floor(Math.random() * (2 * 400)) - 400,
                    -10
                );
                cloud[i].rotation.set(-0.3,0,0);
                cloud[i].material.opacity = 0.8;
                scene.add(cloud[i]);
        }
    });
}

function init() {
    scene = new THREE.Scene();

    const light = new THREE.AmbientLight( 0x404040 ,0);
    scene.add( light );

    directionalLight = new THREE.DirectionalLight(0xffeedd, 5);
    directionalLight.position.set(0, 30, 20);
    scene.add(directionalLight);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    listener = new THREE.AudioListener();
    camera.add( listener );

    camera.rotation.x = 0/180* Math.PI;
    camera.position.x = 0;
    camera.position.y = -20;
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    scene.fog = new THREE.FogExp2(0x11111f, 0.002);
    renderer.setClearColor(scene.fog.color);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const loader = new THREE.GLTFLoader();

    cloudadd();
    staradd(loader);
    
    loader.load('scene.gltf', planeloader);
    loader.load('ufo.gltf', ufoloader);
    loader.load('ufo1.gltf', ufoloader1);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 65 || keyCode == 97) { 
        if(plane.position.x > -150)
        {
            plane.rotation.x = 0.7;
            plane.rotation.z = -0.5;
            plane.position.x -= 1;
            if(flag_big)
            {
                ufob.position.x -= 1;
            }
        } 
    } 
    if (keyCode == 68 || keyCode == 100) {
        if(plane.position.x < 150)
        {
            plane.rotation.x = 0.7;
            plane.rotation.z = 0.5;
            plane.position.x += 1;
            if(flag_big)
            {
                ufob.position.x += 1;
            }
        }
    }
    if(keyCode == 32)
    {
        const loader = new THREE.GLTFLoader();
        loader.load('missile.gltf', function (gltf) {
            bullet = gltf.scene;
            bullet.rotation.set(1.0, 1.6, 0);
            bullet.position.copy(plane.position);
            scene.add(bullet);
            missile.push(bullet);
        }); 
    } 
};

function onDocumentKeyUp(event) {
    var keyCode = event.which;
    if (keyCode == 65 || keyCode == 97) {
        plane.rotation.x = 1.0;
        plane.rotation.z = 0; 
    } 
    if (keyCode == 68 || keyCode == 100) {
        plane.rotation.x = 1.0;
        plane.rotation.z = 0;
    } 
};

// function onMouseDown() {
//     const loader = new THREE.GLTFLoader();
//     loader.load('missile.gltf', function (gltf) {
//         bullet = gltf.scene;
//         bullet.rotation.set(1.0, 1.6, 0);
//         bullet.position.copy(plane.position);
//         scene.add(bullet);
//         missile.push(bullet);
//     });    
// }

let count = 0;

function collision_detect() {
    plane_box_nx = plane.position.x - 30;
    plane_box_px = plane.position.x + 30;
    plane_box_ny = plane.position.y - 30;
    plane_box_py = plane.position.y + 20;

    sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();

    for(let i=0;i<max_star;i++)
    {
        if(star[i].parent === scene)
        {
        if(star[i].position.x>=plane_box_nx && star[i].position.x <= plane_box_px)
            if(star[i].position.y>=plane_box_ny && star[i].position.y <= plane_box_py)
            {
                scene.remove(star[i]);
                flag = 1;
                audioLoader.load( 'sounds/power_up.wav', function( buffer ) {
                    sound.setBuffer( buffer );
                    // sound.setLoop( true );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
            }
        }
        if(flag == 1)
        {
            score += 5;
            sound.pause();
        }
        flag = 0;        
    }

    ufo_box_nx = ufo.position.x - 23;
    ufo_box_px = ufo.position.x + 23;
    ufo_box_ny = ufo.position.y - 15;
    ufo_box_py = ufo.position.y + 15;
    
    for(let i=0;i<missile.length;i++)
    {
        if(ufo.parent === scene && missile[i].parent === scene)
        {
        if(missile[i].position.x>=ufo_box_nx && missile[i].position.x <= ufo_box_px)
            if(missile[i].position.y>=ufo_box_ny && missile[i].position.y <= ufo_box_py)
            {
                scene.remove(missile[i]);
                // scene.remove(ufo);
                flag = 1;
                audioLoader.load( 'sounds/collision.wav', function( buffer ) {
                    sound.setBuffer( buffer );
                    // sound.setLoop( true );
                    sound.setVolume( 0.3 );
                    sound.play();
                });
            }
        }
        if(flag == 1 && health_ufo > 0)
        {
            health_ufo -= 25;
            score += 20;
            sound.pause();
        }
        flag = 0;
    }

    ufo1_box_nx = ufo1.position.x - 23;
    ufo1_box_px = ufo1.position.x + 23;
    ufo1_box_ny = ufo1.position.y - 15;
    ufo1_box_py = ufo1.position.y + 15;
    
    // console.log(ufo1);

    for(let i=0;i<missile.length;i++)
    {
        if(ufo1.parent === scene)
        {
        if(missile[i].position.x>=ufo1_box_nx && missile[i].position.x <= ufo1_box_px)
            if(missile[i].position.y>=ufo1_box_ny && missile[i].position.y <= ufo1_box_py)
            {
                scene.remove(missile[i]);
                // scene.remove(ufo1);
                flag = 1;
                audioLoader.load( 'sounds/collision.wav', function( buffer ) {
                    sound.setBuffer( buffer );
                    // sound.setLoop( true );
                    sound.setVolume( 0.3 );
                    sound.play();
                });
            }
        }
        if(flag == 1 && health_ufo1 > 0)
        {
            health_ufo1 -= 50;
            score += 20;
            sound.pause();
        }
        flag = 0;
    }

    if(flag_big)
    {
        ufob_box_nx = ufob.position.x - 33;
        ufob_box_px = ufob.position.x + 33;
        ufob_box_ny = ufob.position.y - 25;
        ufob_box_py = ufob.position.y + 25;

        for(let i=0;i<missile.length;i++)
        {
            if(ufob.parent === scene && missile[i].parent === scene)
            {
            if(missile[i].position.x>=ufob_box_nx && missile[i].position.x <= ufob_box_px)
                if(missile[i].position.y>=ufob_box_ny && missile[i].position.y <= ufob_box_py)
                {
                    scene.remove(missile[i]);
                    // scene.remove(ufob);
                    // count ++;
                    flag = 1;
                    audioLoader.load( 'sounds/shoot.wav', function( buffer ) {
                        sound.setBuffer( buffer );
                        // sound.setLoop( true );
                        sound.setVolume( 0.2 );
                        sound.play();
                    });                    
                }
            }
            if(flag == 1 && health_ufob > 0)
            {
                health_ufob -= 25;
                score += 20;
                sound.pause();
            }
            flag = 0;
        }

        plane_box_nx = plane.position.x - 30;
        plane_box_px = plane.position.x + 30;
        plane_box_ny = plane.position.y - 30;
        plane_box_py = plane.position.y + 20;

        for(let i=0;i<missile1.length;i++)
        {
            if(plane.parent === scene && missile1[i].parent === scene)
            {
            if(missile1[i].position.x>=plane_box_nx && missile1[i].position.x <= plane_box_px)
                if(missile1[i].position.y>=plane_box_ny && missile1[i].position.y <= plane_box_py)
                {
                    scene.remove(missile1[i]);
                    // scene.remove(plane);
                    flag = 1;
                    audioLoader.load( 'sounds/lose_live.wav', function( buffer ) {
                        sound.setBuffer( buffer );
                        // sound.setLoop( true );
                        sound.setVolume( 0.3 );
                        sound.play();
                    });
                }
            }
            if(flag == 1 && health_plane > 0)
            {
                health_plane -= 50;
                sound.pause();
            }
            flag = 0;
        }
    }
}

function starmove() {
    for (let i=0;i<max_star;i++)
    {
        star[i].rotation.x +=0.01;
        star[i].rotation.y +=0.01;
        star[i].position.y -=0.3;
        if(star[i].position.y <= -140)
        {
            star[i].position.y = 130;         
            if(i%3==0)
            {
                star[i].position.x = Math.floor(Math.random() * (2 * 90)) - 90;
                i++;
                star[i].position.x = star[i-1].position.x + 10;
                i++;
                star[i].position.x = star[i-1].position.x + 10;
            }
            if(star[i].parent !== scene)
            {
                scene.add(star[i]);
            }
        }
    }
}

function cloudmove() {
    for (let i=0;i<3;i++)
    {
        cloud[i].position.y -=1;
        if(cloud[i].position.y <= -window.innerHeight/2)
              cloud[i].position.y = window.innerHeight/2;                 
    }
}

function ufomove()
{
    ufo.rotation.y += 0.01;
    ufo.position.x += adx;
    ufo1.rotation.y += 0.01;
    ufo1.position.x += -adx1;

    if(ufo.position.x <= -150)
    {
        ufo.position.x = -150;
        adx = -adx;
    }
    if(ufo.position.x >= 150)
    {
        ufo.position.x = 150;
        adx = -adx;
    }
    if(ufo1.position.x <= -150)
    {
        ufo1.position.x = -150;
        adx1 = -adx1;
    }
    if(ufo1.position.x >= 150)
    {
        ufo1.position.x = 150;
        adx1 = -adx1;
    }

    if(health_ufo <= 0)
    {
        ufo.rotation.z += 0.01;
        ufo.position.z -= 1;
        if(ufo.position.z < -100)
        {
            scene.remove(ufo);
        }
    }

    if(health_ufo1 <= 0)
    {
        ufo1.rotation.z += 0.01;
        ufo1.position.z -= 1;
        if(ufo1.position.z < -100)
        {
            scene.remove(ufo1);
        }
    }
    if(flag_big)
    {
        if( health_ufob <= 0)
        {
            ufob.rotation.z += 0.1;
            ufob.position.z -= 1;
            if(ufob.position.z < -100)
            {
                scene.remove(ufob);
            }
            document.getElementById("end").textContent = "YOU WON";
        }
    }
}
let missile1 = [];
function bigufo() {
    const loader = new THREE.GLTFLoader();
    loader.load('ufob.gltf', function (gltf) {
        ufob = gltf.scene;
        ufob.rotation.set(1.0, 1.6, 0);
        xpos = plane.position.x;
        ypos = plane.position.y + 180;
        ufob.position.set(xpos, ypos, 50);
        // console.log(ufob);
        scene.add(ufob);
    }); 

    // const loader = new THREE.GLTFLoader();
}

function enemymissile() {
    // console.log("heeelooo");
    const loader = new THREE.GLTFLoader();
    loader.load('missile.gltf', function (gltf) {
        bullet = gltf.scene;
        bullet.rotation.set(1.0, -1.6, 0);
        bullet.position.copy(ufob.position);
        scene.add(bullet);
        missile1.push(bullet);
    }); 
}
var time = 0;
let curr_time, prev_time;

function animate() {
    requestAnimationFrame(animate);

    sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();

    document.getElementById("score").textContent = "Score: " + score;
    document.getElementById("health").textContent = "Health: " + health_plane;
    if(!flag_big)
    {
        document.getElementById("enemy1health").textContent = "Enemy 1 Health: " + health_ufo;
        document.getElementById("enemy2health").textContent = "Enemy 2 Health: " + health_ufo1;
    }
    if(flag_big)
        document.getElementById("enemyboss").textContent = "Enemy Boss: " + health_ufob;

    // console.log(hud_score);
    // console.log(missile);
    delta = clock.getDelta();
    missile.forEach(b => {
        b.translateX(speed * delta); // move along the local z-axis
        // console.log(-speed* delta);
    });

    if(health_ufo <=0 && health_ufo1 <= 0 && flag_big==0)
    {
        // console.log("heehee");
        flag_big = 1;
        bigufo();
        prev_time = delta;
    }
    if(flag_big)
        {
            if(Math.abs(ufob.position.y - plane.position.y) >= 120)
            {
                ufob.position.y -= 1;
            }
            ufob.rotation.y += 0.01;

            // enemymissile();
            // delta = clock.getDelta();
            time += delta;
            curr_time = Math.floor(time);
            // console.log(curr_time,prev_time);
            if(curr_time%5 == 0)
            {
                // console.log(time);
                if(Math.abs(curr_time- prev_time)<= delta)
                {
                    enemymissile();
                }
                prev_time = time;
            }
            missile1.forEach(b => {
                b.translateX(speed * delta); // move along the local z-axis
                // console.log(-speed* delta);
            });            
        }
    if(health_plane <= 0)
    {
        plane.rotation.z += 0.1;
        plane.position.z -= 1;
        if(plane.position.z < -100)
        {
            scene.remove(plane);
        }
                            audioLoader.load( 'sounds/lose_live.wav', function( buffer ) {
                        sound.setBuffer( buffer );
                        // sound.setLoop( true );
                        sound.setVolume( 0.2 );
                        sound.play();
                    });
        document.getElementById("end").textContent = "THE END";
        sound.pause();
    }
    ufomove();
    starmove();
    cloudmove();
    collision_detect();
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('keydown', onDocumentKeyDown, false);
window.addEventListener('keyup', onDocumentKeyUp, false);
// window.addEventListener('mousedown', onMouseDown, false);
init();
animate();