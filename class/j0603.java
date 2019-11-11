// program id : 23
// Read each char from j0603.java and println all char
import java.io.*;
public class j0603 {
  public static void main (String args[]) throws IOException {
    int n = 0;
    byte b[] = new byte[128];
    FileInputStream fin = new FileInputStream("j0603.java");
    while ((n = fin.read(b)) != -1) {
      for(int i=0;i<n;i++) System.out.print((char)b[i]);
    }
    System.out.println(n = fin.read(b)); // -1 = not found
    fin.close();
  }
}
