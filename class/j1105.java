// program id : 42
// 1. กดปุ่มแล้วเปลี่ยนการ paint
// 2. ใช้ Button, Label และ TextField
import java.applet.*;
import java.awt.*;
import java.awt.event.*;
public class j1105 extends Applet implements ActionListener {
  Button b1 = new Button("1");
  Label l1 = new Label("Hello");
  TextField t1 = new TextField("1");
  int row = 10;
  public void paint(Graphics g) {
    row = row + 10;
    g.drawLine(5,row,30,row);
  }
  public void init() {
    setBackground(Color.red);
    add(l1);
    add(b1);
    add(t1);
    t1.addActionListener(this);
    b1.addActionListener(this);
  }
  public void actionPerformed(ActionEvent e) {
    int intb1 = Integer.parseInt(e.getActionCommand());
    intb1 = intb1 + 1;
    String s = Integer.toString(intb1);
    l1.setText(s);
    b1.setLabel(s);
    t1.setText(s);
    repaint();
  }
}

