namespace Utilities.Interfaces {
    public interface INameGenerator {
        string GetRandomName();
        void ReplaceAllNames(string inputFile, string outputFile);
    }
}