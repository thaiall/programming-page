// program id : 6
// 1. แสดงการใช้คำสั่ง switch, case, default, break
// 2. for switch = char, byte, short or int
import java.util.Date;
public class j0203 {
  public static void main(String args[]) {
    byte a = (byte) (new Date().getTime() % 5); 
    switch (a) {
    case 1:  
      System.out.println("one"); break;
    case 2:  
      System.out.println("two"); break;
    default:
      System.out.println("not found" + a);
      break;  
    }
  }
}
