// ::::: โปรแกรมลำดับที่ 39
// 1. พิมพ์คำว่า 1 - 10 ด้วย Applet
// 2. รับค่าจาก getParameter
// <applet code=j1102.class width=200 height=300>
// <param name=x value=hello></applet>
import java.applet.*;
import java.awt.*;
public class j1102 extends Applet {
  int i,j;
  String istr,p;
  public void init() {
    setBackground(Color.yellow);
    p = getParameter("x");
  }
  public void paint(Graphics g) {
    g.setColor(Color.black);
    g.drawString(p,0,10);
    i = 1;
    while (i <= 10) {
      j = 10 * i;
      istr= Integer.toString(i);
      g.drawString(istr,72,j); // 72 pixels = 1 inch
      i++;
    }
  }
}

