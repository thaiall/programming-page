// program id : 11
// 1. แสดงการรับค่าจากแป้นพิมพ์แบบ character 
// 2. รับ 2 ตัวอักษรมาแสดงผลต่อกัน กด enter เพื่อหยุด
// 3. ใช้ try แทน throws IOException
import java.io.*;
public class j0302 {
  public static void main(String args[]) {
    char buf1=0;
    char buf2=0;
    try {
      buf1 = (char)System.in.read();
      buf2 = (char)System.in.read();    	
    } catch (Exception e) { }
    System.out.println("Output is "+buf1+buf2);
  }
}
