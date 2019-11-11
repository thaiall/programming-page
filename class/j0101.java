// program id : 2
// 1. ชนิดข้อมูลพื้นฐาน 6 แบบจาก 8 แบบ
// 2. แบบ boolean ไม่มีการระบุว่าใช้พื้นที่เท่าใด
public class j0101 {
  public static void main(String args[]) {
  // 1. boolean true of false
    boolean b = true;
    System.out.println("boolean = "+b);	    
  // 2. character (2 Bytes) accept unicode
    char y;
    y = 'a'; // 97    
    System.out.println("character = "+y);
    y = 65; // A   
    System.out.println("character = "+y);
  // 3. byte -2^7 to 2^7-1 (1 Byte)
    byte c;
    c = 127;     
    System.out.println("byte = "+c);
    c = (byte)129; // = -127 = 1000 0001     
    System.out.println("byte = "+c);
    c = (byte)130; // = -126 = 1000 0010  = 0111 1110   
    System.out.println("byte = "+c);
  // 4. short -2^15 to 2^15-1 (2 Bytes)
    short a;
    a = 32767;
    System.out.println("Short = "+a);	
  // 5. integer -2^31 to 2^31-1 (4 Bytes)
    int x;
    x = 2147483647;
    System.out.println("Integer = "+x);	
  // 6. long -2^63 to 2^63-1 (8 Bytes)
    long b;
    b = 9223372036854775807L;    
    System.out.println("long = "+b);
  // sequence of translate
    System.out.println(1+1+"1"+1+1); // 2111
    System.out.println("0"+1+ 1 + "1"); // 0111
  }
}
