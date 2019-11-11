// program id : 26
// read from tmp.txt and print
// use FileReader Class
// 1 char per line
import java.io.*;
public class j0606 {
  public static void main (String args[]) throws IOException {
    int i = 0, n = 0;
    char b[] = new char[1];
    FileReader fin = new FileReader("tmp.txt");
    while ((n =  fin.read(b)) != -1) {
      System.out.println(i+" : "+b[0]);
      i = i + 1;
    }
    fin.close();
  }
}
