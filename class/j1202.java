// program id : 44
// 1. เมนู และการรับตัวเลือกแบบ stdin.readLine
// 2. ใช้ if เลือกกระทำ แบบอยู่ใน method เดียวกัน
import java.io.*;
public class j1202 {
  public static void main(String args[]) throws IOException {
    BufferedReader stdin = new BufferedReader(new InputStreamReader(System.in));
    String buf=" ";
    while (!buf.equals("3")) {
      System.out.println("What is your option?");
      System.out.println("1. print 1 to 10");
      System.out.println("2. print 'ok'");
      System.out.println("3. exit");
      buf = stdin.readLine();
      if (buf.equals("1"))
        for (int i=1;i<=10;i++) System.out.println(i);
      if (buf.equals("2")) System.out.println("ok");
    }
    System.out.println("See you again");
  }
}
