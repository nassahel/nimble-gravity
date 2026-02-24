export type Candidate = {
  uuid: string
  candidateId: string
  applicationId: string
  firstName: string
  lastName: string
  email: string
}

export type Job = {
  id: string
  title: string
}

export type CandidateLookupProps = {
  baseUrl: string
  candidate: Candidate | null
  onCandidate: (candidate: Candidate | null) => void
}
