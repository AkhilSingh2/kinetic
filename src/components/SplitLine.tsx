type SplitLineProps = {
  text: string
  italic?: boolean
}

export function SplitLine({ text, italic = false }: SplitLineProps) {
  const words = text.split(' ')
  return (
    <span className={italic ? 'line line-italic' : 'line'} aria-hidden="true">
      {words.map((word, wordIndex) => (
        <span className="word" key={`${word}-${wordIndex}`}>
          {Array.from(word).map((char, charIndex) => (
            <span className="char" key={charIndex}>
              <span className="char-inner">{char}</span>
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}
