export default class Header extends Phaser.GameObjects.Container {
  private highScoreText: Phaser.GameObjects.Text;

  private currentScoreText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.setupComponents();

    this.setScrollFactor(0);

    scene.add.existing(this);
  }

  private setupComponents() {
    const { width: screenWidth } = this.scene.cameras.main;

    const graphics = new Phaser.GameObjects.Graphics(this.scene);
    graphics.fillStyle(0xf5df4d);
    graphics.fillRect(-screenWidth * 0.5, -24, screenWidth, 48);

    const trophy = new Phaser.GameObjects.Image(
      this.scene,
      -screenWidth * 0.4,
      0,
      'trophy'
    );

    this.highScoreText = new Phaser.GameObjects.Text(
      this.scene,
      -screenWidth * 0.35,
      0,
      '0',
      {
        fontFamily: 'Arial',
        fontSize: '30px',
        color: '#000',
        fontStyle: 'bold',
      }
    ).setOrigin(0, 0.5);

    this.currentScoreText = new Phaser.GameObjects.Text(
      this.scene,
      0,
      35,
      '0',
      {
        fontFamily: 'Arial',
        fontSize: '36px',
        color: '#fff',
        fontStyle: 'bold',
      }
    ).setOrigin(0.5, 0);

    this.add([graphics, trophy, this.highScoreText, this.currentScoreText]);
  }

  public setScore(score: number) {
    this.currentScoreText.text = `${score}`;
  }

  public setHighScore(score: number) {
    this.highScoreText.text = `${score}`;
  }
}
