// ::::: โปรแกรมลำดับที่ 38
// 1. พิมพ์คำว่า test1 ด้วย Applet
// 2. ห่างขอบซ้าย 10 pixels ห่างขอบบน 20 pixels
// 3. ประมวลผลวิธีแรก appletviewer j1101.htm
// 4. ประมวลผลวิธีที่สอง explorer j1101.htm
// <applet code=j1101.class width=200 height=50></applet>
import java.applet.*; // Microsoft VM 
import java.awt.*; // Color
public class j1101 extends java.applet.Applet {
  public void paint(Graphics g) {
    g.setColor(new Color(0,0,255));
    g.drawString("test1",10,20);
    g.setColor(Color.red);
    g.drawString("test2",10,40);
  }
}

