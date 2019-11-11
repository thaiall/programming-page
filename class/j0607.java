// program id : 27
// read from tmp.txt and print
// store in array & read array to print
// print 16 char per line
import java.io.*;
public class j0607 {
  public static void main (String args[]) throws IOException {
    int i = 1, n = 0;
    char b[] = new char[16];
    FileReader fin = new FileReader("tmp.txt");
    while ((n =  fin.read(b)) != -1) {
      System.out.print((i-1)*16 + " - " + (i*16-1) + ":");
      System.out.print(b[0]+b[1]+b[2]+b[3]+b[4]+b[5]+b[6]+b[7]+b[8]);
      System.out.println(b[9]+b[10]+b[11]+b[12]+b[13]+b[14]+b[15]);
      i = i + 1;
    }
    fin.close();
  }
}
