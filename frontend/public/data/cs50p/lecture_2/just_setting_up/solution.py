def main():
    text = input("Input: ")
    vowels = "aeiouAEIOU"
    out = ""
    for c in text:
        if c not in vowels:
            out += c
    print("Output:", out)

if __name__ == "__main__":
    main()
