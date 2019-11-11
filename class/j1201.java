// program id : 43
// 1. เมนู และการรับตัวเลือกแบบ System.in.read 
// 2. ใช้ switch เลือกกระทำ สำหรับ 48 คือ 0, 49 คือ 1
import java.io.*;
public class j1201 {
  public static void main(String args[]) throws IOException {
    int buf=49;
    while (buf != 51) {
      if (buf >= 49 && buf <= 51) { 
        System.out.println("What is your option?");
        System.out.println("1. print 1 to 10");
        System.out.println("2. print 'ok'");
        System.out.println("3. exit");
      }
      // buf = (char)System.in.read(); (it have 13 and 10 on enter)
      buf = System.in.read();
      switch (buf) {      
      case 49: // character 1
        for (int i=1;i<=10;i++) {
          System.out.println(i);
        }
        break;      
      case 50: // character 2
        System.out.println("ok");
        break;      
      case 51: break; // character 3
      case 13: break;
      case 10: break;
      default:
        System.out.println("Nothing to do");
        break;
      }
    }
    System.out.println("See you again");
  }
}
