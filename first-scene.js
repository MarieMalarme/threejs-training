const create = ({ geometry, material, positions }, scene) => {
  const getGeometry = geometry
  const getMaterial = new THREE.MeshBasicMaterial(material)
  const object = new THREE.Mesh(getGeometry, getMaterial)
  object.rotation.x = positions[0]
  object.position.x = positions[1]
  object.position.y = positions[2]
  object.position.z = positions[3]
  scene.add(object)
}

const init = () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  )
  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee))
  renderer.setSize(window.innerWidth, window.innerHeight)

  const axes = new THREE.AxisHelper(20)
  scene.add(axes)

  const objects = {
    plane: {
      geometry: new THREE.PlaneGeometry(60, 20),
      material: { color: 0xb300ff },
      positions: [-0.5 * Math.PI, 15, 0, 0],
    },
    cube: {
      geometry: new THREE.BoxGeometry(4, 4, 4),
      material: { color: 0xe5ff00, wireframe: true },
      positions: [0, -4, 3, 0],
    },
    sphere: {
      geometry: new THREE.SphereGeometry(4, 20, 20),
      material: { color: 0xe5ff00, wireframe: true },
      positions: [0, 20, 4, 2],
    },
  }

  Object.values(objects).map(object => create(object, scene))

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-40, 60, -10)
  scene.add(spotLight)

  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 30
  camera.lookAt(scene.position)

  document.getElementById('WEBGL-output').appendChild(renderer.domElement)

  renderer.render(scene, camera)
}

window.onload = init
