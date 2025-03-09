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
