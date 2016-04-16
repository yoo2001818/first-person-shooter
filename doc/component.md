# Components
This document lists components need by the game.

## transform
Transform component. Stores basic transformation data which belongs to a
4x4 matrix.

- position: Vector3. Defaults to (0, 0, 0).
- rotation: Quaternion4. Defaults to (1, 0, 0, 0).
- scale: Vector3. Defaults to (1, 1, 1).

The game engine uses right handed coordinate system because it's built upon
OpenGL.

## mesh
Enables 3D mesh rendering for this entity. Geometry and material are specified,
however this can be changed if instancing or multiple material per single
geometry is implemented.

- geometry: String. Specifies geometry ID from the repository.
- material: String. Specifies material ID from the repository.
- instance: int. Specifies instancing container's ID.
  If specified, renderer uses instancing for this entity. **Unimplemented**

## light
Marks the entity to emit a light. Point and spot lights require transform
component, however ambient and directional lights don't.

- type: String. Specifies the type of the light. Can be one of: `point`, `spot`,
  `ambient`, `directional`.
- position: Vector3. Light's position relative to model position.
- direction: Vector3. Light's direction.
- angle: Vector2. Spot light's angle. one is for lower bound, and one is for
  upper bound.
- attenuation: Number. Light's attenuation, following inverse-square law.
- ambient: Vector3. Ambient light color.
- diffuse: Vector3. Diffuse light color.
- specular: Vector3. Specular light color.

## camera
Marks the entity to use as a camera. Camera objects can be linked to the
rendering system to use as a viewport camera.

- transform: Matrix4. Camera's position relative to model position. If
  unspecified, identity matrix will be used.
- type: String. Specifies the projection type of the camera. Can be one of:
  `orthographic`, `perspective`.
- near: Number. Near bound of the frustum.
- far: Number. Far bound of the frustum.
- fov: Number. Vertical field of view value in radians. (Perspective)
- scale: Number. Vertical scale of the camera. (Orthographic)

## name
Name component. Stores the name for debugging, etc.

- name: String
- icon: String
- color: Number
- tag: Array<String>
