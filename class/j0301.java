// program id : 10
// 1. แสดงการรับค่าจากแป้นพิมพ์แบบ character 
// 2. รับข้อมูลได้เพียง 1 ตัวอักษร และแสดงผล
import java.io.*;
public class j0301 {
  public static void main(String args[]) throws IOException {
    char buf;
    buf = (char)System.in.read();
    System.out.println("Output is "+buf);
  }
}
