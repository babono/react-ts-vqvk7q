export enum COLLECTIBLE_TYPE {
  ATOM = 'atom',
  STAR = 'star',
}

export default class Collectible extends Phaser.Physics.Arcade.Image {
  private randomTypePool = [
    COLLECTIBLE_TYPE.ATOM,
    COLLECTIBLE_TYPE.ATOM,
    COLLECTIBLE_TYPE.ATOM,
    COLLECTIBLE_TYPE.STAR,
  ];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private collectibleType = COLLECTIBLE_TYPE.ATOM
  ) {
    super(scene, x, y, 'atom');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.adjustBasedOnType();
  }

  private adjustBasedOnType() {
    const { collectibleType } = this;
    switch (collectibleType) {
      case COLLECTIBLE_TYPE.ATOM: {
        this.setTexture('atom');
        this.setDisplaySize(16, 16);
        this.body.setSize(80, 80);
        this.body.setOffset(this.body.offset.x, this.body.offset.y + 20);
        break;
      }

      case COLLECTIBLE_TYPE.STAR: {
        this.setTexture('trampoline');
        this.setDisplaySize(48, 27);
        this.body.setSize(40, 20);
        this.body.setOffset(this.body.offset.x, this.body.offset.y);
        break;
      }
    }
  }

  public randomize() {
    this.collectibleType =
      this.randomTypePool[
        Math.floor(Math.random() * this.randomTypePool.length)
      ];
    this.adjustBasedOnType();
  }

  public isAtom() {
    return this.collectibleType === COLLECTIBLE_TYPE.ATOM;
  }

  public isStar() {
    return this.collectibleType === COLLECTIBLE_TYPE.STAR;
  }
}
