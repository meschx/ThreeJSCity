import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GUI } from 'dat.gui';
import Stats from 'three/addons/libs/stats.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
camera.position.x = 0.0;
camera.position.y = 600.0;
camera.position.z = 0.0;
camera.lookAt( scene.position ); 

const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x000000));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
document.getElementsByTagName('body')[0].appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

new RGBELoader()
.setPath( '' )
.load( 'background.hdr', function ( texture ) {

    texture.mapping = THREE.EquirectangularReflectionMapping;
    // texture.mapping = THREE.UVReflectionMapping;
    scene.background = texture;
    scene.environment = texture;

} );

//----------------------------------- textures ------------------------------------------

const brickwall = new THREE.TextureLoader().load( "wall_bricks.jpg" );
brickwall.wrapS = THREE.RepeatWrapping;
brickwall.wrapT = THREE.RepeatWrapping;
brickwall.repeat.set( 2, 2 );

const glasswall = new THREE.TextureLoader().load( "wall_glass.jpg" );
glasswall.wrapS = THREE.RepeatWrapping;
glasswall.wrapT = THREE.RepeatWrapping;
glasswall.repeat.set( 10, 5 );

const plasterwall = new THREE.TextureLoader().load( "wall_plaster.jpg" );
plasterwall.wrapS = THREE.RepeatWrapping;
plasterwall.wrapT = THREE.RepeatWrapping;
plasterwall.repeat.set( 4, 4 );

const suntexture = new THREE.TextureLoader().load( "sun.jpg" );
suntexture.wrapS = THREE.RepeatWrapping;
suntexture.wrapT = THREE.RepeatWrapping;

const moontexture = new THREE.TextureLoader().load( "moon.jpg" );
moontexture.wrapS = THREE.RepeatWrapping;
moontexture.wrapT = THREE.RepeatWrapping;

//----------------------------------- plane ------------------------------------------

const planeGeometry = new THREE.PlaneGeometry( 800, 600 );
const planeMaterial = new THREE.MeshStandardMaterial( {color: 0x0f7300, transparent: false, opacity: 0, side: THREE.DoubleSide, roughness: 1.0, metalness: 0.0} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 0.0;
plane.position.y = -1.0;
plane.position.z = 0.0;
scene.add(plane);

//----------------------------------- sun and moon ------------------------------------------

const sunGeometry = new THREE.SphereGeometry( 60, 64, 64 );
const sunMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, map: suntexture } ); 
const sun = new THREE.Mesh( sunGeometry, sunMaterial );
scene.add(sun)
sun.position.y=600;

const moonGeometry = new THREE.SphereGeometry( 30, 64, 64 );
const moonMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, map: moontexture } ); 
const moon = new THREE.Mesh( moonGeometry, moonMaterial );
scene.add(moon)
moon.position.y=-600;

// ---------------------------------- lights ------------------------------------------------
                
const spotLight = new THREE.SpotLight( 0xffffff, 3000000);
spotLight.position.set( 0, 1800, 0 );
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 800;
spotLight.shadow.mapSize.height = 600; 
spotLight.shadow.camera.near = 0.5; 
spotLight.shadow.camera.far = 500; 
scene.add(spotLight);

// ---------------------------------- roads ------------------------------------------------

function createRoad(width, length, color, x, y) {
    const geometry = new THREE.BoxGeometry(width, length, 1);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const road = new THREE.Mesh(geometry, material);
    road.position.set(x, y, 0.004);
    road.receiveShadow = true;
    return road;
}

function createPavement(width, height, color, x, y) {
    const geometry = new THREE.BoxGeometry(width, height, 1);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const pavement = new THREE.Mesh(geometry, material);
    pavement.position.set(x, y, 0);
    pavement.receiveShadow = true;
    return pavement;
}

function createPavementGroup(pavementConfigs) {
    const group = new THREE.Group();
    pavementConfigs.forEach((config) => {
        const pavement = createPavement(config.width, config.height, config.color, config.x, config.y);
        group.add(pavement);
    });
    return group;
}

const roads = [
    { width: 30, length: 600, color: 0x444444, x: 0, y: 0.003 },
    { width: 574.5, length: 30, color: 0x444444, x: -112.25, y: 0.004 },
    { width: 30, length: 430, color: 0x444444, x: 190, y: 84 },
    { width: 207, length: 30, color: 0x444444, x: 296, y: -116 },
    { width: 30, length: 287, color: 0x444444, x: -185, y: 156 },
    { width: 30, length: 169, color: 0x444444, x: 250, y: -215.5 },
];

const pavements = [
    { width: 7, height: 285, color: 0x99a3a4, x: 18.5, y: -157.5 },
    { width: 32.5, height: 285, color: 0x99a3a4, x: 31.25, y: 157.5 },
    { width: 378, height: 7, color: 0x99a3a4, x: -210.5, y: -18.5 },
    { width: 199.5, height: 7, color: 0x99a3a4, x: -299.75, y: 18.5 },
    { width: 148, height: 7, color: 0x99a3a4, x: -96, y: 18.5 },
    { width: 153, height: 7, color: 0x99a3a4, x: 98.5, y: -18.5 },
    { width: 153, height: 25, color: 0x99a3a4, x: 98.5, y: 27.5 },
    { width: 27.5, height: 277, color: 0x99a3a4, x: 161.25, y: 161 },
    { width: 7, height: 109, color: 0x99a3a4, x: 171.5, y: -76.5 },
    { width: 7, height: 400, color: 0x99a3a4, x: 208.5, y: 99 },
    { width: 194, height: 7, color: 0x99a3a4, x: 302.5, y: -97.5 },
    { width: 67, height: 7, color: 0x99a3a4, x: 201.5, y: -134.5 },
    { width: 134.5, height: 7, color: 0x99a3a4, x: 332.25, y: -134.5 },
    { width: 7, height: 278, color: 0x99a3a4, x: -203.5, y: 160.5 },
    { width: 7, height: 278, color: 0x99a3a4, x: -166.5, y: 160.5 },
    { width: 7, height: 165, color: 0x99a3a4, x: 231.5, y: -217.5 },
    { width: 7, height: 165, color: 0x99a3a4, x: 268.5, y: -217.5 },
    { width: 188, height: 100, color: 0xa9806f, x: 305.5, y: -44 },
    { width: 7, height: 285, color: 0x99a3a4, x: 18.5, y: -157.5 },
    { width: 7, height: 285, color: 0x99a3a4, x: -18.5, y: -157.5 },
    { width: 32.5, height: 285, color: 0x99a3a4, x: 31.25, y: 157.5 },
    { width: 7, height: 285, color: 0x99a3a4, x: -18.5, y: 157.5 },
    { width: 141, height: 40, color: 0x99a3a4, x: 93.5, y: 160 },
    { width: 50, height: 285, color: 0x99a3a4, x: 97.5, y: 158 },
    { width: 141, height: 20, color: 0x99a3a4, x: 87.5, y: 290 },
    { width: 199.5, height: 45, color: 0x99a3a4, x: -299.75, y: 155 },
    { width: 25, height: 13, color: 0x99a3a4, x: -275, y: 28.5 },
    { width: 25, height: 13, color: 0x99a3a4, x: -335, y: 28.5 },
    { width: 25, height: 17.75, color: 0x99a3a4, x: -275, y: 186.25 },
    { width: 25, height: 17.75, color: 0x99a3a4, x: -335, y: 186.25 },
    { width: 25, height: 25, color: 0x99a3a4, x: -30, y: 96 },
    { width: 25, height: 25, color: 0x99a3a4, x: -30, y: 160 },
    { width: 25, height: 25, color: 0x99a3a4, x: -30, y: 224 },
    { width: 20, height: 25, color: 0x99a3a4, x: -153, y: 96 },
    { width: 20, height: 25, color: 0x99a3a4, x: -153, y: 160 },
    { width: 20, height: 25, color: 0x99a3a4, x: -153, y: 224 },
];

const streets = new THREE.Group();

roads.forEach((config) => {
    const road = createRoad(config.width, config.length, config.color, config.x, config.y);
    streets.add(road);
});

pavements.forEach((config) => {
    const pavement = createPavement(config.width, config.height, config.color, config.x, config.y);
    streets.add(pavement);
});

streets.rotation.x = Math.PI / 2;
scene.add(streets);

//------------------------------------ lanters -----------------------------------------------    

const geolbase = new THREE.BoxGeometry( 0.5, 10, 10 );
const matlbase = new THREE.MeshStandardMaterial( {color: 0x000000} );
const lbase = new THREE.Mesh( geolbase, matlbase );
lbase.position.x = 30;
lbase.position.y = 1;
lbase.position.z = 30;
lbase.rotation.z = Math.PI/2;
lbase.receiveShadow = true;
lbase.castShadow = true;
scene.add( lbase );

const geolamppost = new THREE.CylinderGeometry( 4, 4, 70, 4 );
const matlamppost = new THREE.MeshStandardMaterial( {color: 0x000000} );
const lamppost = new THREE.Mesh( geolamppost, matlamppost );
lamppost.position.x = 30;
lamppost.position.y = 35;
lamppost.rotation.y = Math.PI/4;
lamppost.position.z = 30;
lamppost.receiveShadow = true;
lamppost.castShadow = true;
scene.add( lamppost );

const geolupper = new THREE.BoxGeometry( 2, 30, 6);
const matlupper = new THREE.MeshStandardMaterial( {color: 0x000000} );
const lupper = new THREE.Mesh( geolupper, matlupper);
lupper.position.x = 17.8;
lupper.position.y = 70;
lupper.position.z = 30;
lupper.rotation.z = Math.PI/2;
lupper.receiveShadow = true;
lupper.castShadow = true;
scene.add( lupper );

const geolight = new THREE.BoxGeometry( 0.5, 24.25, 6 );
const matlight = new THREE.MeshStandardMaterial( {color: 0xffffff} );
const light = new THREE.Mesh( geolight, matlight );
light.position.x = 15;
light.position.y = 68.75;
light.position.z = 30;
light.rotation.z = Math.PI/2;               
scene.add( light );

var lighter = new THREE.PointLight( 0xffffff, 10000, );
lighter.position.set( 30, 68.75, 30 );
scene.add(lighter);

var lantern = new THREE.Group();
lantern.add( lbase );
lantern.add( lamppost );
lantern.add( lupper );
lantern.add( light );
lantern.add( lighter );
scene.add( lantern );

var lanternData = [
    { x: 0, y: 0, z: 250, ry: 0 },
    { x: 0, y: 0, z: -220, ry: 0 },
    { x: 190, y: 0, z: 135, ry: 0 },
    { x: 190, y: 0, z: -115, ry: 0 },
    { x: -210, y: 0, z: 0, ry: Math.PI/2 },
    { x: -400, y: 0, z: 0, ry: Math.PI/2 },
    { x: -185, y: 0, z: 290, ry: Math.PI },
    { x: -185, y: 0, z: 150, ry: Math.PI },
    { x: 360, y: 0, z: -115, ry: -Math.PI/2 },
    { x: 250, y: 0, z: -190, ry: Math.PI },
    { x: 190, y: 0, z: -30, ry: 0 },
];
  
for (var i = 0; i < lanternData.length; i++) {
    var lanternClone = lantern.clone();
    lanternClone.position.x = lanternData[i].x;
    lanternClone.position.y = lanternData[i].y;
    lanternClone.position.z = lanternData[i].z;
    lanternClone.rotation.y = lanternData[i].ry;
    scene.add(lanternClone);
}
  
var lanterns = new THREE.Group();
scene.add(lanterns);

//------------------------------------ trees/forest -----------------------------------------------    
// Tree 1
const pienG = new THREE.CylinderGeometry(2.5, 2.5, 50, 32);
const pienM = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const pien = new THREE.Mesh(pienG, pienM);
pien.receiveShadow = true;
pien.castShadow = true;

const koronaG = new THREE.CapsuleGeometry(15, 10, 32, 16);
const koronaM = new THREE.MeshStandardMaterial({ color: 0x008000 });
const korona = new THREE.Mesh(koronaG, koronaM);
pien.receiveShadow = true;
pien.castShadow = true;
korona.position.y = 50;

const drzewo = new THREE.Group();
pien.position.y = 25;
drzewo.add(pien);
drzewo.add(korona);

// Tree 2
const pien2G = new THREE.CylinderGeometry(4, 4, 10, 32);
const pien2M = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const pien2 = new THREE.Mesh(pien2G, pien2M);
pien2.receiveShadow = true;
pien2.castShadow = true;

const korona2G = new THREE.ConeGeometry(15, 25, 32);
const korona2M = new THREE.MeshStandardMaterial({ color: 0x004d2f });
const korona2 = new THREE.Mesh(korona2G, korona2M);
pien2.receiveShadow = true;
pien2.castShadow = true;
pien2.position.y = 5;
korona2.position.y = 20;

const choinka = new THREE.Group();
choinka.add(pien2);
choinka.add(korona2);

const korona3 = korona2.clone();
korona3.scale.set(0.66, 0.66, 0.66);
korona3.position.y = 30;
choinka.add(korona3);

const korona4 = korona2.clone();
korona4.scale.set(0.4, 0.4, 0.4);
korona4.position.y = 37;
choinka.add(korona4);

function randomTrees (ax, bx, az, bz, j) {
    for (var i = 0; i < j; i++) {
        var randomX = Math.random() * (ax-bx) + bx;
        var randomZ = Math.random() * (az-bz) + bz;
        var randomType = Math.random() // 0 - drzewo, 1 - choinka
        var randomScale = Math.random() * (2-0.5) + 0.5
    
        if (randomType >= 0.5) {
            var treeClone = drzewo.clone();
            treeClone.position.x = randomX;
            treeClone.position.z = randomZ;
            treeClone.scale.set(randomScale,randomScale,randomScale)
            scene.add(treeClone);
        } else {
            var treeClone = choinka.clone();
            treeClone.position.x = randomX;
            treeClone.position.z = randomZ;
            treeClone.scale.set(randomScale,randomScale,randomScale)
            scene.add(treeClone);   
        }
    }
}

randomTrees(-400,-30,-300,-30,100);
randomTrees(30,150,-30,-100,15);

//pojedyncze drzewa - do sprawdzenia
randomTrees(255,255,-50,-50,1);
randomTrees(355,355,-50,-50,1);

//------------------------------------ office -----------------------------------------------    

const geouoffice1 = new THREE.BoxGeometry( 100, 200, 100 );
const matuoffice1 = new THREE.MeshStandardMaterial( {color: 0xA7C7CB, roughness: 0, metalness: 0, map: glasswall}  );
const uoffice1 = new THREE.Mesh( geouoffice1, matuoffice1 );
uoffice1.position.x = 87.5;
uoffice1.position.y = 124.5;
uoffice1.position.z = 90;
uoffice1.receiveShadow = true;
uoffice1.castShadow = true;
scene.add( uoffice1 );   

const geodoffice = new THREE.BoxGeometry( 25, 25, 100 );
const matdoffice = new THREE.MeshStandardMaterial( {color: 0xccaf89} );
const doffice = new THREE.Mesh( geodoffice, matdoffice );
doffice.position.x = 50;
doffice.position.y = 12;
doffice.position.z = 90;
doffice.receiveShadow = true;
doffice.castShadow = true;
scene.add( doffice );

const geoodoor1 = new THREE.BoxGeometry( 1, 25, 16 );
const matodoor1 = new THREE.MeshStandardMaterial( {color: 0xa4f4f9} );
const odoor1 = new THREE.Mesh( geoodoor1, matodoor1 );
odoor1.position.x = -24;
odoor1.rotation.y = Math.PI/2;
odoor1.position.z = -17.5;
odoor1.receiveShadow = true;
odoor1.castShadow = true;
scene.add( odoor1 );

const geoochink = new THREE.BoxGeometry( 1, 25, 1);
const matochink = new THREE.MeshStandardMaterial( {color: 0x000000 } );
const ochink = new THREE.Mesh( geoochink, matochink );
ochink.position.x = -15.5;
ochink.position.z = -17.5;
ochink.receiveShadow = true;
ochink.castShadow = true;
scene.add( ochink );

const geoodoor2 = new THREE.BoxGeometry( 1, 25, 16 );
const matodoor2 = new THREE.MeshStandardMaterial( {color: 0xa4f4f9} );
const odoor2 = new THREE.Mesh( geoodoor2, matodoor2 );
odoor2.position.x = -7;
odoor2.rotation.y = Math.PI/2;
odoor2.position.z = -17.5;
odoor2.receiveShadow = true;
odoor2.castShadow = true;
scene.add( odoor2 );``

var odoor = new THREE.Group();
odoor.add(odoor1);
odoor.add(odoor2);
odoor.add(ochink);
odoor.position.x = 80;
odoor.position.y = 12;
odoor.position.z = 75;
odoor.rotation.y = Math.PI/2;
scene.add(odoor);

var doffice1 =  new THREE.Group();
doffice1.add(doffice);
doffice1.add(odoor);
scene.add(doffice1); 

var doffice2 =  doffice1.clone();
doffice2.position.x = 175;
doffice2.position.z = 180;
doffice2.rotation.y = Math.PI;
scene.add(doffice2);

var office1 = new THREE.Group();
office1.add(uoffice1);
office1.add(doffice1);
office1.add(doffice2);

office1.position.x = 10;
scene.add(office1);

var office2 = office1.clone();
office2.position.z = 140;
office2.scale.set(1,1.5,1);
scene.add(office2);

//------------------------------------ houses -----------------------------------------------    

const geohouse1 = new THREE.BoxGeometry( 70, 27, 70 );
const mathouse1 = new THREE.MeshStandardMaterial( {color: 0xfff2cc} );
const house1 = new THREE.Mesh( geohouse1, mathouse1);
house1.position.x = 330;
house1.position.y = 13.5;
house1.position.z = -230;
house1.castShadow = true;
house1.receiveShadow = true;
scene.add( house1 );

const geohroof = new THREE.ConeGeometry( 65, 24, 4 );
const mathroof = new THREE.MeshStandardMaterial( {color: 0x4d2600} );
const hroof = new THREE.Mesh( geohroof, mathroof);
hroof.position.x = 330;
hroof.position.y = 38.5;
hroof.position.z = -230;
hroof.rotation.y = Math.PI/4;
hroof.castShadow = true;
hroof.receiveShadow = true;
scene.add( hroof );

var allhouse1 = new THREE.Group();
    allhouse1.add(house1);
    allhouse1.add(hroof);
scene.add(allhouse1);
allhouse1.position.z=300;
allhouse1.position.x = -35;

const allhouse2 = allhouse1.clone()
allhouse2.position.z = 450;
scene.add(allhouse2);

//------------------------------------ church -----------------------------------------------    

const geolaisle = new THREE.BoxGeometry( 40, 55, 60 );
const matlaisle = new THREE.MeshStandardMaterial( {color: 0xcf5a1f, map: brickwall } );
const laisle = new THREE.Mesh( geolaisle, matlaisle );
laisle.position.x = 65;
laisle.receiveShadow = true;
laisle.castShadow = true;
scene.add( laisle );

const geomaisle = new THREE.BoxGeometry( 75, 55, 100 );
const matmaisle = new THREE.MeshStandardMaterial( {color: 0xcf5a1f, map: brickwall } );
const maisle = new THREE.Mesh( geomaisle, matmaisle );
maisle.position.x = 7.5;
maisle.position.z = -10;
maisle.receiveShadow = true;
maisle.castShadow = true;
scene.add( maisle );

const geocaisle = new THREE.CylinderGeometry( 40.25, 40.25, 55, 64 );
const matcaisle = new THREE.MeshStandardMaterial( {color: 0xcf5a1f, map: brickwall } );
const caisle = new THREE.Mesh( geocaisle, matcaisle );
caisle.position.x = 7.5;
caisle.position.z = 35;
caisle.receiveShadow = true;
caisle.castShadow = true;
scene.add( caisle );

const georaisle = new THREE.BoxGeometry( 40, 55, 60 );
const matraisle = new THREE.MeshStandardMaterial( {color: 0xcf5a1f, map: brickwall } );
const raisle = new THREE.Mesh( georaisle, matraisle );
raisle.position.x = -50;
raisle.receiveShadow = true;
raisle.castShadow = true;
scene.add( raisle );

const geoloft = new THREE.BoxGeometry( 30, 80, 30 );
const matloft = new THREE.MeshStandardMaterial( {color: 0xcf5a1f, map: brickwall } );
const loft = new THREE.Mesh( geoloft, matloft );
loft.position.x = 10;
loft.position.y = 47.5;
loft.position.z = -30;
loft.receiveShadow = true;
loft.castShadow = true;
scene.add( loft );

const geomroof = new THREE.ConeGeometry( 21, 25, 4 );
const matmroof = new THREE.MeshStandardMaterial( {color: 0x654321} );
const mroof = new THREE.Mesh( geomroof, matmroof );
mroof.position.x = 10;
mroof.position.y = 100;
mroof.rotation.y = Math.PI/4;
mroof.position.z = -30;
mroof.receiveShadow = true;
mroof.castShadow = true;
scene.add( mroof );

const geocroof = new THREE.SphereGeometry( 40, 64, 16 );
const matcroof = new THREE.MeshStandardMaterial( { color: 0x654321 } );
const croof = new THREE.Mesh( geocroof, matcroof );
croof.position.x = 7.5;
croof.position.y = 19.5;
croof.position.z = 35.115;
croof.receiveShadow = true;
croof.castShadow = true;
scene.add( croof );

var church = new THREE.Group();
    church.add(laisle);
    church.add(maisle);
    church.add(caisle); 
    church.add(raisle);   
    church.add(loft);
    church.add(mroof);
    church.add(croof);  
    church.position.x = 135;
    church.position.y = 27;
    church.rotation.y = Math.PI;
    church.position.z = -200;
scene.add(church);

//------------------------------------ apartments #1 #2 -----------------------------------------------    

const geoflats = new THREE.BoxGeometry( 160, 140, 70 );
const matflats = new THREE.MeshStandardMaterial( {color: 0xbf8a03, map: plasterwall} );
const flats = new THREE.Mesh( geoflats, matflats);
flats.position.x = -305;
flats.position.y = 69.5; 
flats.position.z = 70;
flats.receiveShadow = true;
flats.castShadow = true;
scene.add( flats );

const geofroof1 = new THREE.BoxGeometry( 160, 0.5, 70 );
const matfroof1 = new THREE.MeshStandardMaterial( {color: 0x75716d} );
const froof1 = new THREE.Mesh( geofroof1, matfroof1 );
froof1.position.x = -305;
froof1.position.y = 140; 
froof1.position.z = 70;
scene.add( froof1 );

var flats1 = new THREE.Group();
    flats1.add(flats);
    flats1.add(froof1);
scene.add(flats1);

var flats2 = flats1.clone();
    flats2.position.z = 160;
    flats2.scale.set(1,1.50,1);
scene.add(flats2);

//------------------------------------ apartments #3 -----------------------------------------------    

const geoflat3 = new THREE.BoxGeometry( 100, 140, 240 );
const matflat3 = new THREE.MeshStandardMaterial( {color: 0x44607b, map: plasterwall} );
const flat3 = new THREE.Mesh( geoflat3, matflat3 );
flat3.position.x = -93;
flat3.position.y = 69.5; 
flat3.position.z = 160;
flat3.receiveShadow = true;
flat3.castShadow = true;
scene.add( flat3 );

const geofroof2 = new THREE.BoxGeometry( 100, 0.5, 240 );
const matfroof2 = new THREE.MeshStandardMaterial( {color: 0x75716d} );
const froof2 = new THREE.Mesh( geofroof2, matfroof2 );
froof2.position.x = -93;
froof2.position.y = 140; 
froof2.position.z = 160;
scene.add( froof2 );

//------------------------------------ football field -----------------------------------------------    
// Jak przy domach, zmiana planów

function createPlaneGeometry(width, height, color) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide });
    return new THREE.Mesh(geometry, material);
}

function createCylinderGeometry(radiusTop, radiusBottom, height, color) {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 64, 4, true, 2*Math.PI, Math.PI);
    const material = new THREE.MeshStandardMaterial({ color });
    return new THREE.Mesh(geometry, material);
}

const fieldDimensions = { width: 90, length: 130, lineWidth: 1, circleRadius: 10, goalPostWidth: 87, goalPostHeight: 1, goalPostDepth: 0.5 };
const linePositions = [
    { x: -373, y: -220, width: 1, height: 126 },
    { x: -330, y: -283, width: 87, height: 1 },
    { x: -355, y: -270, width: 1, height: 25 },
    { x: -305, y: -270, width: 1, height: 25 },
    { x: -330, y: -257.5, width: 51, height: 1 },
    { x: -330, y: -273.5, width: 25, height: 1 },
    { x: -342, y: -278, width: 1, height: 10 },
    { x: -317, y: -278, width: 1, height: 10 }
];

const field1 = createPlaneGeometry(fieldDimensions.width, fieldDimensions.length, 0x348C31);
field1.position.set(-330,-220, 0 );
field1.receiveShadow = true;
scene.add(field1);

const fline1 = new THREE.Group();
linePositions.forEach((position) => {
    const line = createPlaneGeometry(position.width, position.height, 0xffffff);
    line.position.set(position.x, position.y, -0.1);
    fline1.add(line);
});

const fcircle = createCylinderGeometry(fieldDimensions.circleRadius + 2, fieldDimensions.circleRadius, 0.5, 0xffffff);
fcircle.position.set(-330, -258, -0.1);
fcircle.rotation.x = Math.PI / 2;
fcircle.rotation.y = Math.PI / 2;
fline1.add(fcircle);

scene.add(fline1);

const fline2 = fline1.clone();
fline2.position.set(-660, -440, -0.1);
fline2.rotation.z = Math.PI;
scene.add(fline2);

const fline3 = createPlaneGeometry(fieldDimensions.goalPostWidth, fieldDimensions.goalPostHeight, 0xffffff);
fline3.position.set(-330, -220, -0.1);
scene.add(fline3);

const fcircle1 = createCylinderGeometry(fieldDimensions.circleRadius + 3, fieldDimensions.circleRadius + 2, 0.5, 0xffffff);
fcircle1.position.set(-330, -220, 0.1);
fcircle1.rotation.x=Math.PI/2;
scene.add(fcircle1);
const fcircle2 = fcircle1.clone()
fcircle2.rotation.y=Math.PI;

const football = new THREE.Group();
football.add(field1);
football.add(fline1);
football.add(fline2);
football.add(fline3);
football.add(fcircle1);
football.add(fcircle2);
football.rotation.x = Math.PI / 2;
football.position.set(670, 0, 0);

scene.add(football);

//------------------------------------ ANIMATE() + SYMULACJA DZIEŃ/NOC + LICZNIK FPS -----------------------------------------------    

var angle = 0;
const stats = new Stats()
document.body.appendChild(stats.dom);

function animate() 
{
    
    setTimeout
    ( function()
    {
        requestAnimationFrame( animate );
        }, 
        1000 / 120
        
    );

    controls.update();
    renderer.render( scene, camera );
    angle += 0.01;
    spotLight.position.x = 1000 * Math.sin(angle);
    spotLight.position.y = 1000 * Math.cos(angle);
    sun.position.x = 1000 * Math.sin(angle);
    sun.position.y = 1000 * Math.cos(angle);
    moon.position.x = -(1000 * Math.sin(angle));
    moon.position.y = -(1000 * Math.cos(angle));
    // const spotLighthelper = new THREE.CameraHelper( spotLight.shadow.camera );
    // scene.add( spotLighthelper );
    stats.update()
}

animate();

window.addEventListener
(
    'resize',
    function() 
    {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.render( scene, camera );
    },
    false
);

const axesHelper = new THREE.AxesHelper( 400 );
axesHelper.position.y = 1;
scene.add( axesHelper );

//------------------------------------ GUI/CAMERAS -----------------------------------------------                

function updateCamera()
{
    camera.updateProjectionMatrix();
}

var gui;                          
var parameters;  

gui = new GUI();

parameters = {position: "center"};

var position = gui.add(parameters, 'position', ['center', 'street', 'pavement', 'lantern', 'office roof', 'forest']).name('Position').listen();

position.onChange(function(value)
{
    switch (value) {
        case "center":
            camera.position.set(0, 600, 0);
            break;
        case "street":
            camera.position.set(10, 1, 0);
            break;
        case "pavement":
            camera.position.set(-20, 1, 20);
            break;
        case "lantern":
            camera.position.set(15, 72, 25);
            break;
        case "office roof":
            camera.position.set(45, 235, 45);
            break;
        case "forest":
            camera.position.set(-330, 1, -220);
            break;
    }
    camera.position.needsUpdate = true;
});

gui.open();