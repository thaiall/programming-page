// program id : 13
// 1. รับตัวเลข 2 จำนวนแล้วนำมาบวกกัน เพื่อแสดงผล
// 2. ใช้ BufferedReader ในการรับข้อมูล
// 3. โปรแกรมนี้ควรมี import package
import java.io.*;
public class j0304 {
  public static void main(String args[]) throws IOException {
    BufferedReader stdin = new BufferedReader(new InputStreamReader(System.in));
    String buf;
    int i1,i2,i3;
    buf = stdin.readLine();
    i1 = Integer.parseInt(buf);
    i2 = Integer.parseInt(stdin.readLine());
    i3 = i1 + i2;
    System.out.println("Output is "+i1+" + "+i2+" = "+i3);
  }
}
