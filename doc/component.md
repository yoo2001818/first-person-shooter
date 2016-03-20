# Components
This document lists components need by the game.

## position
Position component, Also known as transform component, stores the
axis aligned bounding box (AABB) of the entity.
It stores two Vectors, one for position, and one for width / height.

![Position component](./positionComp.png)

- translate: Vector2D - Stores the base position of the entity.
- scale: Vector2D - Stores half the size of the entity, Which is
`sqrt(2) * radius`, `(radius, radius)` for a circle.
- rotation: Number - Probably won't be implemented.

## geometry
Geometry component. Stores the shape of the entity, which can be one of the
following:

- point
- circle
- rectangle
- line

## collision
Collision component. Makes the component colide with other entities.

- weight: Number - Weight of the entity.
- knockback: boolean - Sets whether if the entity should update its position
  to avoid collision with the other entity. If this is false, the entity will
  just pass through the other entity, which is OK for bullets, etc.

## velocity
Velocity component. Stores the current velocity of the entity.

## gravity
Gravity component. Enables velocity reduction. To support both velocity
reduction and gravity, this uses 2*3 matrix for computing new velocity value,
which is:
```
x y c | x
x y c | y
0 0 1 | c
```
The last row is always `[0, 0, 1]`, since constant value doesn't change at all.

- matrix: Matrix3x2 - the transformation matrix.

## render
Render component. Stores the rendering information.

- color: Number - Color of the entity used in editor mode.
- texture: String - Texture of the entity used in playing mode.
- uv: Float32Array - UV map of the entity. Probably won't be implemented.
- type: 'wall' | 'floor' | 'ceil' - The render type of the entity.

## name
Name component. Stores the name for debugging, etc.

- name: String
- icon: String
- color: Number
- tag: Array<String>
