const create = (key, { geometry, color, positions, shadow }, scene) => {
  const getGeometry = geometry
  const getMaterial = new THREE.MeshPhongMaterial({ color })
  const object = new THREE.Mesh(getGeometry, getMaterial)
  object.name = key
  object.rotation.x = positions[0]
  object.position.x = positions[1]
  object.position.y = positions[2]
  object.position.z = positions[3]
  object.castShadow = shadow === 'cast'
  object.receiveShadow = shadow === 'receive'
  scene.add(object)
}

const getStats = () => {
  const stats = new Stats()
  stats.setMode(0)
  document.getElementById('stats-output').appendChild(stats.domElement)
  return stats
}

const controls = {
  rotation: 0.02,
  revolution: 0.03,
}

const gui = new dat.GUI()
gui.add(controls, 'rotation', 0, 0.5)
gui.add(controls, 'revolution', 0, 0.5)

let camera
let scene
let renderer

const init = () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  )
  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee, 1.0))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMapEnabled = true

  const axes = new THREE.AxisHelper(20)
  scene.add(axes)

  const stats = getStats()

  const objects = {
    plane: {
      geometry: new THREE.PlaneGeometry(60, 20),
      color: 0xb300ff,
      positions: [-0.5 * Math.PI, 15, 0, 0],
      shadow: 'receive',
    },
    cube: {
      geometry: new THREE.BoxGeometry(4, 4, 4),
      color: 0xe5ff00,
      positions: [0, 0, 4, 0],
      shadow: 'cast',
    },
    sphere: {
      geometry: new THREE.SphereGeometry(2.5, 20, 20),
      color: 0x00ff7b,
      positions: [0, 0, 0, 0],
      shadow: 'cast',
    },
  }

  Object.entries(objects).map(([key, object]) => create(key, object, scene))

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-40, 60, -10)
  spotLight.castShadow = true
  scene.add(spotLight)

  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 30
  camera.lookAt(scene.position)

  document.getElementById('WEBGL-output').appendChild(renderer.domElement)

  let step = 0

  const renderScene = () => {
    stats.update()

    const cube = scene.children.find(child => child.name === 'cube')
    cube.rotation.x += controls.rotation
    cube.rotation.y += controls.rotation
    cube.rotation.z += controls.rotation

    const sphere = scene.children.find(child => child.name === 'sphere')
    step += controls.revolution
    sphere.position.x = 20 * Math.cos(step)
    sphere.position.y = 20 * Math.sin(step)

    spotLight.position.x = -40 * Math.cos(step)
    spotLight.position.y = 60 * Math.sin(step)

    requestAnimationFrame(renderScene)
    renderer.render(scene, camera)
  }
  renderScene()
}

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onResize, false)

window.onload = init
