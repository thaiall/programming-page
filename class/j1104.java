// program id : 41
// 1. Rect = สี่เหลี่ยม Oval = วงรี Arc = เส้นรอบวง
// 2. Oval กว้าง 20 สูง 30
// 3. Arc เริ่มองศาที่ 0 ไปถึงองศา 120
import java.applet.*;
import java.awt.*;
public class j1104 extends Applet {
  Image img;
  public void init() {
    setBackground(Color.green);
    img = getImage(getDocumentBase(),"x.gif");
  }
  public void paint(Graphics g) {
    g.setColor(Color.black);
    g.drawLine(5,10,30,40);
    g.drawRect(50,50,80,80);
    g.drawOval(50,50,20,30);
	g.setColor(Color.white);
    g.fillOval(50,50,20,30); // backgound is white
    g.setColor(Color.red);
    g.drawArc(40,30,55,55,0,120);
    int[] x={0,80,100,5,10};
    int[] y={0,50,80,80,30};
    g.drawPolygon(x,y,5);
    g.drawImage(img, 0, 200, this);
  }
}

