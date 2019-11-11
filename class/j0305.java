// program id : 14
// 1. รับตัวเลขไปเรื่อย ๆ ไปแสดงผล จนกระทั่งรับเลข 0
// 2. ใช้ BufferedReader ในการรับข้อมูล
import java.io.*;
public class j0305 {
  public static void main(String args[]) throws IOException {
    BufferedReader stdin = new BufferedReader(new InputStreamReader(System.in));
    String buf;
    int i;
    System.out.println("Get until receive 0");
    do {
      buf = stdin.readLine();
      i = Integer.parseInt(buf);
      System.out.println("Output is "+i);
    } while (i != 0);
  }
}
