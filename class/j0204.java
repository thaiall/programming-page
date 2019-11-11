// program id : 7
// 1. แสดงการใช้คำสั่ง for และ while 
// 2. โปรแกรมนี้ใช้ i นอก for ไม่ได้
public class j0204 {
  public static void main(String args[]) {
    System.out.println("ASCII character :: ");
    for (int i=0; i<256; i++) {
      System.out.print((char)i + " "); 
      // System.out.println(i);  // 0 - 255 
    }	
    int i = 0;
    while(i++ < 5) System.out.println(i);
  }
}
