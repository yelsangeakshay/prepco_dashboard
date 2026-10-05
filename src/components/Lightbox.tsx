import { useEffect, useRef, useState } from 'react'
import '../styles/lightbox.css'

export interface LightboxItem {
  full: string
  thumb: string
  /** Natural width in CSS pixels, so the image never renders larger than designed. */
  width: number
  label: string
  count: string
}

interface Props {
  items: LightboxItem[]
  index: number | null
  onIndex: (index: number) => void
  onClose: () => void
}

export function Lightbox({ items, index, onIndex, onClose }: Props) {
  const open = index !== null && items.length > 0
  const idx = index ?? 0
  const item = open ? items[idx] : null
  const [src, setSrc] = useState('')
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const swipe = useRef({ x: 0, y: 0 })

  // Lock page scroll while open and give focus back to whatever opened the viewer.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    document.body.classList.add('lock')
    closeRef.current?.focus()
    return () => {
      document.body.classList.remove('lock')
      opener?.focus?.()
    }
  }, [open])

  // Show the thumbnail straight away, then swap in the full image once it has loaded.
  const full = item?.full
  const thumb = item?.thumb
  useEffect(() => {
    if (!full || !thumb) return
    setSrc(thumb)
    let live = true
    const im = new Image()
    im.onload = () => {
      if (live) setSrc(full)
    }
    im.src = full
    stageRef.current?.scrollTo(0, 0)
    return () => {
      live = false
    }
  }, [full, thumb])

  useEffect(() => {
    if (index === null || items.length < 2) return
    ;[1, -1].forEach((d) => {
      new Image().src = items[(index + d + items.length) % items.length].full
    })
  }, [index, items])

  useEffect(() => {
    if (!open) return
    const go = (d: number) => onIndex((idx + d + items.length) % items.length)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab') {
        const f = [prevRef.current, nextRef.current, linkRef.current, closeRef.current]
        const i = f.indexOf(document.activeElement as HTMLButtonElement | HTMLAnchorElement)
        if (e.shiftKey && i <= 0) {
          e.preventDefault()
          f[f.length - 1]?.focus()
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault()
          f[0]?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, idx, items.length, onIndex, onClose])

  if (!open || !item) return null

  const go = (d: number) => onIndex((idx + d + items.length) % items.length)

  return (
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Full size mockup"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="lbbar">
        <span className="lbtitle">{item.label}</span>
        <span className="lbcount">{item.count}</span>
        <a className="lbbtn" ref={linkRef} href={item.full} target="_blank" rel="noopener">
          Open <span className="lbl">image</span>
        </a>
        <button className="lbbtn primary" type="button" ref={closeRef} onClick={onClose}>
          Close
        </button>
      </div>
      <div
        className="lbstage"
        ref={stageRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        onTouchStart={(e) => {
          swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - swipe.current.x
          const dy = e.changedTouches[0].clientY - swipe.current.y
          if (Math.abs(dx) > 70 && Math.abs(dx) > 1.6 * Math.abs(dy)) go(dx < 0 ? 1 : -1)
        }}
      >
        <img src={src} alt={item.label} style={{ '--w': `${item.width}px` } as React.CSSProperties} />
      </div>
      <div className="lbnav">
        <button className="lbbtn" type="button" ref={prevRef} aria-label="Previous" onClick={() => go(-1)}>
          &larr; Previous
        </button>
        <button className="lbbtn" type="button" ref={nextRef} aria-label="Next" onClick={() => go(1)}>
          Next &rarr;
        </button>
      </div>
      <p className="lbhint">Left and right arrows move, Escape closes</p>
    </div>
  )
}
